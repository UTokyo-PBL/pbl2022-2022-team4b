import requests
import json
import datetime
import pytz
from urllib.parse import quote

def format_resp(json_resp):
    json_obj = json.loads(json_resp)
    return json.dumps(json_obj, indent=2)

def print_resp(response):
    try:
        print(f"status: {response.status_code}\ncontent: {format_resp(response.text)}")
    except:
        print(f"status: {response.status_code}\ncontent: {response.text}")
        exit(1)

def get_ids(response):
    try:
        json_obj = json.loads(response.text)
        return [i['id'] for i in json_obj]
    except:
        print("failed to get the id")
        exit(1)

def get_time(*args):
    return datetime.datetime(*args, tzinfo=pytz.UTC)

def get_time_str(*args):
    return quote(get_time(*args).isoformat())


login_data = {"username":"user1@test.com", "password": "cnmtest1"}
new_calendar = {
    'owner': "user1@test.com",
    'title': "calendar111",  
    'description': "test calendar 111", 
    'members':["user2@test.com"],
    'guests':[]
}
new_task = {
    'title': "task111",
    'description': "test task 111",
    'calendar': 0,
    'start_time': get_time(2022,12,10,10,0),
    'end_time': get_time(2022,12,10,11,30),
}

# Account TEST

print("\n### (POST)login ###\n")
response = requests.post('http://localhost:8000/api/account/login/', data=login_data)
print_resp(response)

headers = {
    "authorization": f"Token {dict(response.json()).get('token')}"
}

print("\n### (GET)user info ###\n")
response = requests.get('http://localhost:8000/api/account/user/', headers=headers)
print_resp(response)

# Calendar TEST

print("\n### (GET)calendar info ###\n")
response = requests.get('http://localhost:8000/api/scheduler/calendars/', headers=headers)
print_resp(response)

print("\n### (POST)new calendar  ###\n")
response = requests.post('http://localhost:8000/api/scheduler/calendars/', headers=headers, data=new_calendar)
print_resp(response)

calendar_id = response.json()['id']

print("\n### (GET)calendar info ###\n")
response = requests.get('http://localhost:8000/api/scheduler/calendars/', headers=headers)
print_resp(response)

print("\n### (UPDATE)calendar update ###\n")
new_new_calendar = new_calendar.copy()
new_new_calendar['description'] = 'updated test calendar 111'
new_new_calendar['members'] = ['user3@test.com']
response = requests.put(f"http://localhost:8000/api/scheduler/calendars/{calendar_id}/", headers=headers, data=new_new_calendar)
print_resp(response)

print("\n### (GET)updated calendar ###\n")
response = requests.get(f'http://localhost:8000/api/scheduler/calendars/{calendar_id}/', headers=headers)
print_resp(response)


# Task TEST

new_task['calendar'] = calendar_id

print("\n### (GET)task info ###\n")
params = f"calendar={calendar_id}"
response = requests.get(f'http://localhost:8000/api/scheduler/tasks/?{params}', headers=headers)
# GET /api/scheduler/tasks/?calendar=91
print_resp(response)

print("\n### (POST)new task  ###\n")
response = requests.post('http://localhost:8000/api/scheduler/tasks/', headers=headers, data=new_task)
# POST /api/scheduler/tasks/
print_resp(response)

task_id = response.json()['id']

print("\n### (UPDATE)task update ###\n")
new_new_task = new_task.copy()
new_new_task['description'] = 'updated test task 111'
new_new_task['end_time'] = datetime.datetime(2022,12,10,14,0)
params = f"calendar={calendar_id}"
response = requests.put(f"http://localhost:8000/api/scheduler/tasks/{task_id}/?{params}", headers=headers, data=new_new_task)
# PUT /api/scheduler/tasks/51/?calendar=91
print_resp(response)

print("\n### (GET)task info ###\n")
params = f"calendar={calendar_id}"
response = requests.get(f'http://localhost:8000/api/scheduler/tasks/{task_id}/?{params}', headers=headers)
# GET /api/scheduler/tasks/51/?calendar=91
print_resp(response)

print("\n### (GET)updated task with time range ###\n")
params = f"calendar={calendar_id}&start={get_time_str(2022,12,10)}&end={get_time_str(2022,12,11)}"
response = requests.get(f'http://localhost:8000/api/scheduler/tasks/?{params}', headers=headers)
# GET /api/scheduler/tasks/?calendar=91&start=2022-12-10T00%3A00%3A00%2B00%3A00&end=2022-12-11T00%3A00%3A00%2B00%3A00
print_resp(response)

print("\n### (GET)no task with wrong time range ###\n")
params = f"calendar={calendar_id}&start={get_time_str(2022,12,11)}&end={get_time_str(2022,12,12)}"
response = requests.get(f'http://localhost:8000/api/scheduler/tasks/?{params}', headers=headers)
# GET /api/scheduler/tasks/?calendar=91&start=2022-12-11T00%3A00%3A00%2B00%3A00&end=2022-12-12T00%3A00%3A00%2B00%3A00
print_resp(response)

print("\n### (DELETE)delete task ###\n")
response = requests.delete(f'http://localhost:8000/api/scheduler/tasks/{task_id}/?calendar={calendar_id}', headers=headers)
# DELETE /api/scheduler/tasks/51/?calendar=91
print(f"status: {response.status_code}")


# # Delete calendar

print("\n### (DELETE)delete calendar ###\n")
response = requests.delete(f'http://localhost:8000/api/scheduler/calendars/{calendar_id}/', headers=headers)
print(f"status: {response.status_code}")
