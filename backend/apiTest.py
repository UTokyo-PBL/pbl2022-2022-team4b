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
register_data = {"username":"user1@test.com", "first_name":"user1", "password": "cnmtest1", "email": "user1@test.com"}
new_calendar = {
    'owner': "user1@test.com",
    'title': "calendar111",  
    'description': "test calendar 111", 
    'members':["user2@test.com", "user3@test.com"],
    'guests':[]
}
new_task = {
    'title': "task111",
    'description': "test task 111",
    'calendar': 0,
    'start_time': get_time(2022,12,10,10,0).isoformat(),
    'end_time': get_time(2022,12,10,11,30).isoformat(),
}
find_slot = {
    'start_time': get_time(2022,12,10).isoformat(),
    'end_time': get_time(2022,12,11).isoformat(),
    'duration': 180,
    'start_index': 0,
    'end_index': 9
}

# Account TEST

print("\n### (POST)register ###\n")
response = requests.post('http://localhost:8000/api/account/register/', json=register_data)
print_resp(response)

print("\n### (POST)login ###\n")
response = requests.post('http://localhost:8000/api/account/login/', json=login_data)
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
response = requests.post('http://localhost:8000/api/scheduler/calendars/', headers=headers, json=new_calendar)
print_resp(response)

calendar_id = response.json()['id']

print("\n### (GET)calendar info ###\n")
response = requests.get('http://localhost:8000/api/scheduler/calendars/', headers=headers)
print_resp(response)

print("\n### (UPDATE)calendar update ###\n")
new_new_calendar = new_calendar.copy()
new_new_calendar['description'] = 'updated test calendar 111'
new_new_calendar['members'] = ['user3@test.com']
response = requests.put(f"http://localhost:8000/api/scheduler/calendars/{calendar_id}/", headers=headers, json=new_new_calendar)
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
response = requests.post('http://localhost:8000/api/scheduler/tasks/', headers=headers, json=new_task)
# POST /api/scheduler/tasks/
print_resp(response)

task_id = response.json()['id']

print("\n### (POST)find slot  ###\n")
response = requests.post('http://localhost:8000/api/scheduler/findslot/', headers=headers, json=find_slot)
# POST /api/scheduler/findslot/
print_resp(response)

print("\n### (UPDATE)task update ###\n")
new_new_task = new_task.copy()
new_new_task['description'] = 'updated test task 111'
new_new_task['end_time'] = get_time(2022,12,10,16,0).isoformat()
params = f"calendar={calendar_id}"
response = requests.put(f"http://localhost:8000/api/scheduler/tasks/{task_id}/?{params}", headers=headers, json=new_new_task)
# PUT /api/scheduler/tasks/51/?calendar=91
print_resp(response)

print("\n### (POST)find slot  ###\n")
response = requests.post('http://localhost:8000/api/scheduler/findslot/', headers=headers, json=find_slot)
# POST /api/scheduler/findslot/
print_resp(response)

print("\n### (GET)task info ###\n")
params = f"calendar={calendar_id}"
response = requests.get(f'http://localhost:8000/api/scheduler/tasks/{task_id}/?{params}', headers=headers)
# GET /api/scheduler/tasks/51/?calendar=91
print_resp(response)

print("\n### (GET)task of all calendars ###\n")
params = f"calendar=all"
response = requests.get(f'http://localhost:8000/api/scheduler/tasks/?{params}', headers=headers)
# GET /api/scheduler/tasks/?calendar=all
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


# Invite Code TEST

print("\n### (GET)invite code ###\n")
response = requests.get(f'http://localhost:8000/api/scheduler/invitecode/{calendar_id}/', headers=headers)
print_resp(response)

invite_code = response.json()['invite_code']
guests = response.json()['guests']
guests.append('user2@test.com')  # Add one guest

print("\n### (POST)user1 logout ###\n")
response = requests.post(f'http://localhost:8000/api/account/logout/', headers=headers)
print(f"status: {response.status_code}")

print("\n### (POST)user2 login ###\n")
login_data = {"username":"user2@test.com", "password": "cnmtest2"}
response = requests.post('http://localhost:8000/api/account/login/', json=login_data)
print_resp(response)

headers = {
    "authorization": f"Token {dict(response.json()).get('token')}"
}

print("\n### (PUT)update members/guests ###\n")
new_list = {'invite_code': invite_code}
new_list['test'] = 'test'
response = requests.put(f'http://localhost:8000/api/scheduler/invitecode/{calendar_id}/add/', headers=headers, json=new_list)
print_resp(response)

print("\n### (GET)added calendar ###\n")
response = requests.get(f'http://localhost:8000/api/scheduler/calendars/{calendar_id}/', headers=headers)
print_resp(response)

print("\n### (PUT)update invite code ###\n")
new_list['invite_code'] = "new code"  # Reset the code as 'new code', informing the backend to create a new one
new_list['members'] = []
new_list['guests'] = guests
response = requests.put(f'http://localhost:8000/api/scheduler/invitecode/{calendar_id}/', headers=headers, json=new_list)
print_resp(response)


# # Delete calendar

print("\n### (DELETE)delete calendar ###\n")
response = requests.delete(f'http://localhost:8000/api/scheduler/calendars/{calendar_id}/', headers=headers)
print(f"status: {response.status_code}")

print("\n### (POST)logout ###\n")
response = requests.post(f'http://localhost:8000/api/account/logout/', headers=headers)
print(f"status: {response.status_code}")


