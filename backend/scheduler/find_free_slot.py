# from . import Calendar, Task
# from django.contrib.auth.models import User
from datetime import datetime, timedelta
from django.utils import timezone
from django.db.models.query import QuerySet
from typing import Tuple, Optional, Union, List, Iterator
from functools import cmp_to_key
# from pprint import pprint


def count_conflict_time(start_point_list, end_point_list):
    res = timedelta(0)
    for x, y in zip(start_point_list, end_point_list):
        res += y - x
    return res


def move_min_gap(start_point_list, end_point_list, cur_task_list, 
                 cur_start_point, cur_end_point, task_ordered, min_gap, task_no):
    for i in range(len(start_point_list)-1, -1, -1):  # iterate reversely for removal
        if start_point_list[i] <= cur_start_point + min_gap:
            start_point_list[i] = cur_start_point + min_gap
        if end_point_list[i] == cur_end_point < task_ordered[cur_task_list[i]]['end_time']:
            end_point_list[i] = min(cur_end_point + min_gap, task_ordered[cur_task_list[i]]['end_time'])
        elif end_point_list[i] == cur_end_point > task_ordered[cur_task_list[i]]['end_time']:
            assert 0  # can be deleted if there is no bug
        if task_ordered[cur_task_list[i]]['end_time'] <= cur_start_point + min_gap:
            del start_point_list[i], end_point_list[i], cur_task_list[i]
    
    while task_no < len(task_ordered) and task_ordered[task_no]['start_time'] == cur_end_point + min_gap:
        start_point_list.append(task_ordered[task_no]['start_time'])
        end_point_list.append(task_ordered[task_no]['start_time'])
        cur_task_list.append(task_no)
        task_no += 1
    return task_no


def find_min_gap(end_point_list, cur_start_point, cur_end_point, cur_day_end,
                 task_ordered, task_no, max_move=None):
    min_gap = cur_day_end - cur_end_point
    for end_point in end_point_list:
        # gap between task end point and cur_start_point
        if timedelta(0) < end_point - cur_start_point < min_gap:
            min_gap = end_point - cur_start_point
        # gap between task end point and cur_end_point
        if timedelta(0) < cur_end_point - end_point < min_gap:
                min_gap = cur_end_point - end_point        

    # gap between cur_end_day and cur_end_point
    if cur_day_end - cur_end_point < min_gap and (task_no == len(task_ordered) or \
        task_no < len(task_ordered) and task_ordered[task_no]['start_time'] > cur_day_end):
        min_gap = cur_day_end - cur_end_point
    
    # gap between next task and cur_end_point
    if task_no < len(task_ordered) and task_ordered[task_no]['start_time'] - cur_end_point < min_gap:
        min_gap = task_ordered[task_no]['start_time'] - cur_end_point

    # if current slot is free, and free_slot_move is smaller than current min_gap, 
    # then only make a small move
    if max_move and max_move < min_gap:
        min_gap = max_move
    
    return min_gap


def add_candidate(candidate_list, start_point_list, end_point_list, cur_start_point, cur_end_point):
    conflict_people_cnt = 0
    for start_point in start_point_list:
        if start_point != cur_end_point:
            conflict_people_cnt += 1
    candidate_list.append((
        cur_start_point, 
        count_conflict_time(start_point_list, end_point_list),
        conflict_people_cnt)
    )


def allocate_free_slot(duration: timedelta, 
                       task_list: Union[QuerySet, List[Tuple[datetime, datetime]]],
                       repeat_mode: str='one-time',
                       least_conflict_time_first=False,
                       task_span: Optional[Tuple[datetime, datetime]]=None
                       ) -> Iterator[Tuple[datetime, timedelta, int]]:
    """Find a proper relatively free slot among a list of users for new task.
    Args:
        duration: The duration of the new task.
        task_list: A list of tasks (can be query set of tasks or list of tuples(start_datetime, end_datetime)).
        repeat_mode: The repeat mode of the new task.
        task_span: The range of time to find the free slot, should be in format (start_datetime, end_datetime)
            both sides closed. If None, it will consider the nearest time to today.
    
    Returns:
        candidate_list: a list of tuple [(best_start_time_for_task, total_conflict_time, total_conflict_member)...]
    """
    assert repeat_mode in ['one-time', 'daily', 'weekly', 'monthly', 'yearly']

    """Basic Settings"""
    # Only consider the daytime
    day_start, day_end = timedelta(hours=7, minutes=30), timedelta(hours=21, minutes=0)        
    # if task_span is not given, then only consider the following 30 days from now.
    default_days_span = timedelta(days=30)
    # define the maximum optimal results in generator
    max_loop_n = 10
    # the maximum move of slot window
    max_move = timedelta(hours=1, minutes=0)
    
    """Task Span"""
    if task_span:
        span_start, span_end = task_span
    else:
        span_start, span_end = timezone.now(), timezone.now() + default_days_span
    assert timedelta(0) < duration < span_end - span_start
    span_start_day = span_start.replace(hour=0, minute=0, second=0, microsecond=0)
    span_end_day = span_end.replace(hour=0, minute=0, second=0, microsecond=0)

    """Order the Tasks"""
    if type(task_list) == QuerySet:
        task_ordered = task_list.order_by('start_time').values()  #.values_list('start_time', 'end_time')
    else:  # type(task_list) == List; List[Tuple[start_time, end_time]]
        task_list.sort(key=lambda k: k[0])
        task_ordered = [{'start_time': st, 'end_time': et} for st, et in task_list]
    for task in task_ordered:
        assert task['end_time'] > task['start_time']
    task_cnt = len(task_ordered)

    """Find all good slots"""
    candidate_list = []  # list of tuples (start_time, total_conflict_time, total_conflict_people)
    start_point_list, end_point_list, cur_task_list = [], [], []
    task_no = 0
    if repeat_mode == 'one-time':
        if duration < day_end - day_start:
            # if duration is less than day span, then only arrange the task between [day_start, day_end] for each day
            span_days = (span_end_day - span_start_day).days + 1
            for daydelta in range(span_days):
                cur_day = span_start_day + timedelta(daydelta)
                if daydelta == 0:  # first day in the span
                    cur_day_start = max(cur_day + day_start, span_start)
                else:
                    cur_day_start = cur_day + day_start
                if daydelta == span_days - 1:  # last day in the span
                    cur_day_end = min(cur_day + day_end, span_end)
                else:
                    cur_day_end = cur_day + day_end
                cur_start_point = cur_day_start
                cur_end_point = cur_start_point + duration
                if cur_end_point > cur_day_end:
                    break
                
                # delete done tasks from last day
                for i in range(len(cur_task_list)-1, -1, -1):
                    if task_ordered[cur_task_list[i]]['end_time'] <= cur_day_start:
                        del start_point_list[i], end_point_list[i], cur_task_list[i]
                    else:
                        start_point_list[i] = cur_start_point
                        end_point_list[i] = min(task_ordered[cur_task_list[i]]['end_time'], cur_end_point)

                while task_no < task_cnt and task_ordered[task_no]['start_time'] <= cur_end_point:
                    if task_ordered[task_no]['end_time'] >= cur_start_point:
                        start_point_list.append(max(task_ordered[task_no]['start_time'], cur_start_point))
                        end_point_list.append(min(task_ordered[task_no]['end_time'], cur_end_point))
                        cur_task_list.append(task_no)
                    task_no += 1
                add_candidate(candidate_list, start_point_list, end_point_list, cur_start_point, cur_end_point)

                while cur_end_point < cur_day_end:
                    min_gap = find_min_gap(end_point_list, cur_start_point, cur_end_point, cur_day_end,
                                           task_ordered, task_no, max_move=max_move)
                    
                    task_no = move_min_gap(start_point_list, end_point_list, cur_task_list, 
                                        cur_start_point, cur_end_point, task_ordered, min_gap, task_no)
                    
                    assert min_gap > timedelta(0)
                    cur_start_point += min_gap
                    cur_end_point += min_gap
                    add_candidate(candidate_list, start_point_list, end_point_list, cur_start_point, cur_end_point)
        else:
            # The case that duration is longer than maximum daily span
            cur_start_point = span_start
            cur_end_point = cur_start_point + duration

            while task_no < task_cnt and task_ordered[task_no]['start_time'] <= cur_end_point:
                if task_ordered[task_no]['end_time'] >= cur_start_point:
                    start_point_list.append(max(task_ordered[task_no]['start_time'], cur_start_point))
                    end_point_list.append(min(task_ordered[task_no]['end_time'], cur_end_point))
                    cur_task_list.append(task_no)
                task_no += 1
            add_candidate(candidate_list, start_point_list, end_point_list, cur_start_point, cur_end_point)

            while cur_end_point < span_end:
                min_gap = find_min_gap(end_point_list, cur_start_point, cur_end_point, span_end,
                                       task_ordered, task_no, max_move=max_move)

                task_no = move_min_gap(start_point_list, end_point_list, cur_task_list, 
                                       cur_start_point, cur_end_point, task_ordered, min_gap, task_no)
                
                assert min_gap > timedelta(0)
                cur_start_point += min_gap
                cur_end_point += min_gap
                add_candidate(candidate_list, start_point_list, end_point_list, cur_start_point, cur_end_point)

    else:
        # TODO: complete other cases
        assert 0
    
    """Generate Result"""

    def cmp1(x, y):
        if x[1] == y[1]:
            return x[2] - y[2]
        if x[1] < y[1]:
            return -1
        return 1
    
    def cmp2(x, y):
        if x[2] == y[2]:
            if x[1] < y[1]:
                return -1
            return x[1] > y[1]
        return x[2] - y[2]

    if least_conflict_time_first:
        candidate_list.sort(key=cmp_to_key(cmp1))
    else:
        candidate_list.sort(key=cmp_to_key(cmp2))
    # pprint(candidate_list)
    # loop_n = min(len(candidate_list), max_loop_n)
    # cand_n = 0
    if candidate_list:
        # while True:
        #     yield candidate_list[cand_n]
        #     cand_n = (cand_n + 1) % loop_n
        return candidate_list
    else:
        # while True:
        #     yield None
        return []


### Tests ###
test_no = 1
def print_result(iterator, iter_times=12):
    global test_no
    print(f'Test {test_no} result:')
    for i in range(iter_times):
        result = next(iterator)
        if result:
            start_time, total_conflict_time, total_conflict_member = result
            print(f'{i+1}-th best start time: {start_time}')
            print(f'Total conflict time: {total_conflict_time}')
            print(f'Total members that have conflict tasks: {total_conflict_member}\n')
        else:
            print('No result!')
        _ = input('Press [ENTER] to continue...')
    test_no += 1


def test1():
    # empty task list
    task_list = []
    duration = timedelta(hours=1, minutes=30)
    task_span = (datetime(2023, 1, 1, 0, 0), datetime(2023, 1, 20, 0, 0))
    f = allocate_free_slot(duration, task_list, task_span=task_span)
    print_result(f)


def test2():
    # in a single day
    task_list = [
        (datetime(2023, 1, 1, 5, 30), datetime(2023, 1, 1, 9, 30)),
        (datetime(2023, 1, 1, 8, 0), datetime(2023, 1, 1, 16, 0)),
        (datetime(2023, 1, 1, 9, 0), datetime(2023, 1, 1, 10, 0)),
        (datetime(2023, 1, 1, 9, 0), datetime(2023, 1, 1, 9, 30)),
        (datetime(2023, 1, 1, 13, 0), datetime(2023, 1, 1, 15, 0)),
        (datetime(2023, 1, 1, 12, 0), datetime(2023, 1, 1, 14, 30)),
        (datetime(2023, 1, 1, 11, 30), datetime(2023, 1, 1, 20, 0))]
    duration = timedelta(hours=1, minutes=30)
    task_span = (datetime(2023, 1, 1, 0, 0), datetime(2023, 1, 2, 0, 0))
    f = allocate_free_slot(duration, task_list, task_span=task_span)
    print_result(f)


def test3():
    # in multiple days
    task_list = [
        (datetime(2022, 12, 1, 5, 30), datetime(2023, 12, 10, 9, 30)),

        (datetime(2023, 1, 1, 5, 30), datetime(2023, 1, 1, 9, 30)),
        (datetime(2023, 1, 1, 8, 0), datetime(2023, 1, 1, 16, 0)),
        (datetime(2023, 1, 1, 9, 0), datetime(2023, 1, 1, 10, 0)),
        (datetime(2023, 1, 1, 9, 0), datetime(2023, 1, 1, 9, 30)),
        (datetime(2023, 1, 1, 13, 0), datetime(2023, 1, 1, 15, 0)),
        (datetime(2023, 1, 1, 12, 0), datetime(2023, 1, 1, 14, 30)),
        (datetime(2023, 1, 1, 11, 30), datetime(2023, 1, 2, 20, 0)),
        
        (datetime(2023, 1, 2, 5, 30), datetime(2023, 1, 2, 6, 30)),
        (datetime(2023, 1, 2, 7, 40), datetime(2023, 1, 2, 16, 0)),
        (datetime(2023, 1, 2, 9, 0), datetime(2023, 1, 2, 10, 0)),
        (datetime(2023, 1, 2, 9, 0), datetime(2023, 1, 3, 9, 30)),
        (datetime(2023, 1, 2, 13, 0), datetime(2023, 1, 2, 15, 0)),
        (datetime(2023, 1, 2, 12, 0), datetime(2023, 1, 2, 14, 30)),
        (datetime(2023, 1, 2, 11, 30), datetime(2023, 1, 2, 20, 20)),
        
        (datetime(2023, 1, 3, 5, 30), datetime(2023, 1, 4, 9, 30)),
        (datetime(2023, 1, 3, 8, 0), datetime(2023, 1, 3, 16, 0)),
        (datetime(2023, 1, 3, 9, 10), datetime(2023, 1, 3, 10, 0)),
        (datetime(2023, 1, 3, 9, 0), datetime(2023, 1, 3, 9, 30)),
        (datetime(2023, 1, 3, 13, 0), datetime(2023, 1, 3, 15, 0)),
        (datetime(2023, 1, 3, 12, 0), datetime(2023, 1, 3, 14, 30)),
        (datetime(2023, 1, 3, 11, 30), datetime(2023, 1, 5, 20, 0)),

        (datetime(2023, 2, 1, 5, 30), datetime(2023, 2, 10, 9, 30)),
        ]
    duration = timedelta(hours=1, minutes=30)
    task_span = (datetime(2023, 1, 1, 10, 0), datetime(2023, 1, 3, 20, 0))
    f = allocate_free_slot(duration, task_list, task_span=task_span)
    print_result(f)


def test4():
    # new task larger than day span
    task_list = [
        (datetime(2022, 12, 23, 5, 30), datetime(2023, 1, 7, 9, 30)),
        (datetime(2023, 1, 1, 8, 0), datetime(2023, 1, 12, 16, 0)),
        (datetime(2023, 1, 5, 9, 0), datetime(2023, 1, 9, 10, 0)),
        (datetime(2023, 1, 9, 9, 0), datetime(2023, 1, 19, 9, 30)),
        (datetime(2023, 1, 15, 13, 0), datetime(2023, 1, 15, 15, 0)),
        (datetime(2023, 1, 16, 12, 0), datetime(2023, 1, 17, 14, 30)),
        (datetime(2023, 1, 12, 11, 30), datetime(2023, 1, 25, 20, 0))]
    duration = timedelta(days=2, hours=1, minutes=30)
    task_span = (datetime(2023, 1, 1, 0, 0), datetime(2023, 1, 20, 0, 0))
    f = allocate_free_slot(duration, task_list, task_span=task_span)
    print_result(f)

if __name__ == '__main__':
    #test1()
    #test2()
    test3()
    #test4()
