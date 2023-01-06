# Backend Instruction

The backend part is based on Django, and mainly uses Python, so please follow the instructions below to setup your environment and start developing.

## Version Information

Python: 3.8
Pip: 22.3


### Python Environment

Please make sure you already setup and installed the Python environment and **Pip**

If not, please follow this tutorial: https://www.digitalocean.com/community/tutorial_series/how-to-install-and-set-up-a-local-programming-environment-for-python-3

### Install Dependencies

Use `pip` to install `pipenv`
```
pip install pipenv
```

Install the dependencies and enable the virtual environment:

```bash
pipenv shell  # Enable the virtual environment shell

pipenv install  # Install the dependencies listed in Pipfile
```

### Basic Logic of Backend

The basic logic of backend is to provide several `APIs` that give access to specific resources or services. The total structure of backend is based on the Django Rest Framework. We didn't use the typical views and models of Django, instead, we use `serializers` to handle the transformation between objects and messages sent to or received from frontend. What's more, `ViewSets` is used to simplify the API design. After register this to the `Routers`, all the interaction methods (create, list, delete, update...) are handled implicitly by DRF. We only need to manually change several of them.

To be brief, when the request arrives, it will be handled to the APIs defined in `views.py`, the API will use the defined `serializer` to transform the data and interact with database. After processing, return the response to the user.

Emphrasize that if you found one API (i.e. /scheduler/calendars/1/) is not explicitly defined, it means that it's handled by `Routers`, if you found one request (i.e. create a new Calendar or delete one task) is not processed explicitly, it means that the `serializer` installed in the `viewset` will process it. 


### Developing Instructions

**Superuser**

> Username: admin  
> Passwd: 123456  

Login to `^/admin/` as superuser, to gain a fully access to the database. For more details, please refer to https://docs.djangoproject.com/en/4.1/ref/contrib/admin/ 

**When updates the models.py in a certain app**

Create migration for the database:
```
./manage.py makemigrations [app name]
```

**When changing other database settings**

Migrate database use this command:
```bash
./manage.py migrate
```

**Urls arrangement**

For each app, we defined an `urls.py` under the app directory, please directly add the new paths to the pathpatterns in this app url file. In `backend/urls.py`, we use `include` to import all the app url files.

**APIs arrangement**

All the APIs are defined in the `views.py`, following the standard Django structure. Of course you can define other functions for the specific functionality, but the API endpoints should be in the `views.py`.

**API Usage**

To use the API, please follow this blog post:
http://v1k45.com/blog/modern-django-part-4-adding-authentication-to-react-spa-using-drf/

Generally to say, after login, you need to add such a header for authorization: `authorization: Token [Your Token]`, in which the token is received in login response. 

When testing, I also found it's necessary to add this header: `X-CSRFToken: [Token]`, in which the token is received from the response.

So generally to say, the request should include a header configuration similar to this:

```javascript
const postRequestConf = {
    withCredentials: true,
    headers: {
        'X-CSRFToken': Cookies.get('csrftoken'),
        'authorization': 'Token XXXXXX'
    }
}
```

The content of request or response is normal Json format String, so directly process it to get the fields. 

The APIs are based on `RESTful` API standard. We use `django-rest-framework` to realize this. For details, please refer to https://www.django-rest-framework.org/tutorial/quickstart/

### Useful Materials

**manyToMany in Models**

Please refer to the doc: https://docs.djangoproject.com/en/4.1/topics/db/examples/many_to_many/

For the usage of foreignKey, search the Django tutorial.

**Query database**

To get the models stored in the database, Django provides some convenient query tools. We can directly use `filter` methods with different **fields** like `__id`, `__range` to gain the items we want. For more details, please refer to: 
https://docs.djangoproject.com/en/4.1/topics/db/queries/
and
https://docs.djangoproject.com/en/4.1/ref/models/querysets/#id4

**Design Serializer**

Django Rest Framework provides some classes which are very convenient to use. For serializer, please refer to this doc: https://www.django-rest-framework.org/api-guide/serializers/. Normally,  `ModelSerializer` is enough for our project.

**Design API**

DRF also gives some existing API classes we can directly use, combining with `Routers`, we don't need to write all the handlers of requests by ourselves. However, for some request (i.e. GET tasks with url parameters), we need to design the specific methods manually. In this case, we need to override some methods. 

References:

ViewSet: https://www.django-rest-framework.org/api-guide/viewsets/#modelviewset

Combining viewset and router: https://www.django-rest-framework.org/tutorial/6-viewsets-and-routers/#using-routers



### API Table

Please refer to the `apiTest.py` for all the API usage.
The usage examples shown in this table may not be complete. Please refer to `apiTest.py` and `apiTest-result.txt`, which contains possible usages and outputs of all the APIs.

**[POST] /accounts/register/**
This API is responsible for the user registeration function.
- Description: It serializes input and validates it with `serializer.is_valid()`, stores the serializer instance if it's valid.
- Input: `register_data`that contains `user_name`, `fist_name`, `password`, `email`.
- Return: If the input is not valid, it returns `HTTP 400 Bad Request`; If the input is valid, it returns the extra context provided to the serializer class.
- Note: `email` is treated as the unique user name.
```python
# An example of usage
register_data = {"username":"user1@test.com", "first_name":"user1", "password": "cnmtest1", "email": "user1@test.com"}
response = requests.post('http://localhost:8000/api/account/register/', data=register_data)
print(reponse)

# Printed result
status: 400
content: {
  "username": [
    "A user with that username already exists."
  ]
}
```

**[POST] /accounts/login/**
This API is reponsible for the user login function.
- Description: It takes the input login info and validates it with `AuthTokenSerializer`.
- Input: `login_data`that contains `email` and `password`.
- Return:  If the input is not valid, it returns `HTTP 400 Bad Request`; If the input is valid, it returns a `200` OK response, with datetime format used for `expiry` and a `token`.
```python
# An example of usage
login_data = {"username":"user1@test.com", "password": "cnmtest1"}
response = requests.post('http://localhost:8000/api/account/login/', data=login_data)
print_resp(response)

# Printed result
status: 200
content: {
  "expiry": "2023-01-02T02:54:07.562561Z",
  "token": "496a963237952e40b47c8e83fb317bab401d03f7e81badd82acdb04c4cf44c32"
}
```

**[POST] /accounts/logout/**
This API is reponsible for the user logout function.
- Description: This logout function is achieved by inheriting the `LogoutView` from `konx`. It accepts only a post request with an empty body. It responds to Knox Token Authentication. On a successful request, the token used to authenticate is deleted from the system and can no longer be used to authenticate.
- Input: empty.
- Return: return `204 No Content`, indicating that request has succeeded.
```python
# An example of usage
response = requests.post(f'http://localhost:8000/api/account/logout/', headers=headers)
print(f"status: {response.status_code}")

# Printed result
status: 204
```

**[GET] /accounts/user/**
This API is reponsible for retrieving the user profile.
- Input: A `header` contains the token of the current user.
- Return: If the object can be retrieved, it returns a `200` OK response, with a serialized representation of the user information (profile) as the body of the response; Otherwise, it will return a `404 Not Found`.
```python
# An example of usage
response = requests.get('http://localhost:8000/api/account/user/', headers=headers)
print_resp(response)

# Printed result
status: 200
content: {
  "name": "user1",
  "email": "user1@test.com",
  "user": {
    "id": 5,
    "username": "user1@test.com"
  }
}
```

**[GET] /scheduler/calendars/**
This API is reponsible for retrieving the information of **all** calendars the current user is engaged in.
- Input: A `header` contains the token of the current user.
- Returns:  If the object can be retrieved, it returns a `200` OK response, with a serialized representation of a list of the calendars information as the body of the response.
```python
# An example of usage
response = requests.get('http://localhost:8000/api/scheduler/calendars/', headers=headers)
print_resp(response)

# Printed result
status: 200
content: [
  {
    "id": 149,
    "title": "test1",
    "created_time": "2022-12-15T14:20:55.922718Z",
    "description": "calendar created by react",
    "owner": "user1@test.com",
    "members": [
      "user2@test.com"
    ],
    "guests": []
  }
]
```

**[POST] /scheduler/calendars/**
This API is reponsible for creating a new calendar for the current user.
- Input: A `header` contains the token of the current user and a `new_calendar` serializer.
- Returns: It returns a `201` OK response, with a serialized representation of the newly added calendar information as the body of the response.
```python
# An example of usage
new_calendar = {
    'owner': "user1@test.com",
    'title': "calendar111",  
    'description': "test calendar 111", 
    'members':["user2@test.com", "user3@test.com"],
    'guests':[]
}
response = requests.post('http://localhost:8000/api/scheduler/calendars/', headers=headers, data=new_calendar)
print_resp(response)

# Printed result
status: 201
content: {
  "id": 154,
  "title": [
    "calendar111"
  ],
  "created_time": "2022-12-20T14:31:47.828527Z",
  "description": [
    "test calendar 111"
  ],
  "owner": "user1@test.com",
  "members": [
    "user2@test.com"
  ],
  "guests": []
}
```

**[PUT] /scheduler/calendars/{calendar_id}/**
This API is reponsible for updating information of a exsiting calendar.
- Input: A `header` contains the token of the current user and a `new_calendar` serializer.
- Returns: It returns a `200` OK response, with a serialized representation of the updated calendar information as the body of the response.
```python
# An example of usage
calendar_id = response.json()['id']
new_new_calendar = new_calendar.copy()
new_new_calendar['description'] = 'updated test calendar 111'
new_new_calendar['members'] = ['user3@test.com']
response = requests.put(f"http://localhost:8000/api/scheduler/calendars/{calendar_id}/", headers=headers, data=new_new_calendar)
print_resp(response)

# Printed result
status: 200
content: {
  "id": 154,
  "title": [
    "calendar111"
  ],
  "created_time": "2022-12-20T14:31:47.828527Z",
  "description": [
    "updated test calendar 111"
  ],
  "owner": "user1@test.com",
  "members": [
    "user3@test.com"
  ],
  "guests": []
}
```

**[GET] /scheduler/invitecode/{calendar_id}/**
This API is reponsible for showing the information of a calendar
- Input:  A `header` contains the token of the current user (and `calendar_id`).
- Returns: It returns a `200` OK response, with a serialized representation of the calendar information as the body of theresponse.
```python
# An example of usage
response = requests.get(f'http://localhost:8000/api/scheduler/calendars/{calendar_id}/', headers=headers)
print_resp(response)

# Printed result
status: 200
content: {
  "id": 201,
  "title": "calendar111",
  "created_time": "2023-01-01T16:54:07.618797Z",
  "description": "updated test calendar 111",
  "owner": "user1@test.com",
  "members": [
    "user2@test.com",
    "user3@test.com"
  ],
  "guests": []
}
```

**[DELETE] /scheduler/invitecode/{calendar_id}/**
This API is reponsible for showing the information of a calendar
- Input:  A `header` contains the token of the current user (and `calendar_id`).
- Returns: It returns a `204` response, indicating the deletion is finished.
```python
# An example of usage
response = requests.delete(f'http://localhost:8000/api/scheduler/calendars/{calendar_id}/', headers=headers)
print(f"status: {response.status_code}")

# Printed result
status: 204
# Printed result
status: 200
content: {
  "id": 201,
  "title": "calendar111",
  "created_time": "2023-01-01T16:54:07.618797Z",
  "description": "updated test calendar 111",
  "owner": "user1@test.com",
  "members": [
    "user2@test.com",
    "user3@test.com"
  ],
  "guests": []
}
```

**[GET] /scheduler/tasks/?{params}/**
This API is reponsible for updating information of a exsiting calendar.
- Input: A `header` contains the token of the current user.
- Returns: It returns a `200` OK response, with a serialized representation of a list of all tasks information within a specified calendar as the body of the response.
```python
# An example of usage
params = f"calendar={calendar_id}" # you need to specify a calendar_id here
response = requests.get(f'http://localhost:8000/api/scheduler/tasks/?{params}', headers=headers)
print_resp(response)

# Printed result
status: 200
content: [] # a empty list indicates there is no task within the specified calendar right now
```

**[POST] /scheduler/tasks/**
This API is reponsible for creating a new task to an existing calendar.
- Input: A `header` contains the token of the current user and a `new_task` serializer.
- Returns: It returns a `201` OK response,  with a serialized representation of the newly added task information as the body of the response.
```python
# An example of usage
new_task = {
    'title': "task111",
    'description': "test task 111",
    'calendar': 0,
    'start_time': get_time(2022,12,10,10,0),
    'end_time': get_time(2022,12,10,11,30),
}
new_task['calendar'] = calendar_id # you need to specify a calendar_id here
response = requests.post('http://localhost:8000/api/scheduler/tasks/', headers=headers, data=new_task)
print_resp(response)

# Printed result
status: 201
content: {
  "id": 103,
  "title": "task111",
  "description": "test task 111",
  "completed": false,
  "calendar": 154,
  "start_time": "2022-12-10T10:00:00Z",
  "end_time": "2022-12-10T11:30:00Z"
}
```

**[PUT] /scheduler/tasks/{task_id}/?{params}/**
This API is reponsible for updating information of an exsiting task within an exsiting calendar.
- Input: A `header` contains the token of the current user and an updated `new_new_task` serializer.
- Returns: It returns a `200` OK response, with a serialized representation of the updated task information as the body of the response.
```python
# An example of usage
new_new_task = new_task.copy() # here we changed the information of an existing calendar 
new_new_task['description'] = 'updated test task 111'
new_new_task['end_time'] = datetime.datetime(2022,12,10,16,0)
params = f"calendar={calendar_id}"
response = requests.put(f"http://localhost:8000/api/scheduler/tasks/{task_id}/?{params}", headers=headers, data=new_new_task)
# PUT /api/scheduler/tasks/51/?calendar=91
print_resp(response)
# Printed result
status: 200
content: {
  "id": 103,
  "title": "task111",
  "description": "updated test task 111",
  "completed": false,
  "calendar": 154,
  "start_time": "2022-12-10T10:00:00Z",
  "end_time": "2022-12-10T16:00:00Z"
}
```

**[GET] /scheduler/tasks/?{params}/**
This API is reponsible for retrieving tasks of all calendars.
- Input: A `header` contains the token of the current user. 
- Returns: It returns a `200` OK response, with a list of serializers of the tasks as the body of the response.
```python
# An example of usage
params = f"calendar=all" # for retrieving task of all calendars, we need to specify params to be f"calendar=all"
response = requests.get(f'http://localhost:8000/api/scheduler/tasks/?{params}', headers=headers)
# GET /api/scheduler/tasks/?calendar=all
print_resp(response)
# Printed result
status: 200
content: [
  {
    "id": 103,
    "title": "task111",
    "description": "updated test task 111",
    "completed": false,
    "calendar": 154,
    "start_time": "2022-12-10T10:00:00Z",
    "end_time": "2022-12-10T16:00:00Z"
  }
]
```

**[GET] /scheduler/tasks/?{params}/**
This API is reponsible for retrieving a list of tasks in a given calendars within a given time range.
- Input: A `header` contains the token of the current user. 
- Returns: It returns a `200` OK response, with a list of serializers of the tasks as the body of the response.
```python
# An example of usage
params = f"calendar={calendar_id}&start={get_time_str(2022,12,10)}&end={get_time_str(2022,12,11)}" # we need to specify the calendar id and search time range here
response = requests.get(f'http://localhost:8000/api/scheduler/tasks/?{params}', headers=headers)
print_resp(response)
# Printed result
status: 200
content: [
  {
    "id": 103,
    "title": "task111",
    "description": "updated test task 111",
    "completed": false,
    "calendar": 154,
    "start_time": "2022-12-10T10:00:00Z",
    "end_time": "2022-12-10T16:00:00Z"
  }
]
```

**[Delete] /scheduler/tasks/{task_id}/?calendar={calendar_id}/**
This API is reponsible for delete an existing task within a calendar
- Input: A `header` contains the token of the current user. 
- Returns: It returns a `204` response once completed.
```python
# An example of usage
response = requests.delete(f'http://localhost:8000/api/scheduler/tasks/{task_id}/?calendar={calendar_id}', headers=headers) # you need to specify task_id and calendar_id here
print(f"status: {response.status_code}")
# Printed result
status: 204
```

**[POST] /scheduler/findslot/**
This API is reponsible for finding 
- Input: A `header` contains the token of the current user and a `find_slot` serializer. `find_slot` contains five elements: `start_time` and `end_time` of the search range (in iso format), a specified `duration` (minutes) of slot, a `start_index` and a `end_index`, indicating the range of candidates we wish to return; If we don't specify `start_time` and `end_time`, the API will search within 30 days in the future by default.
- Returns: It returns a `200` OK response, and a list of serializer containing the optimal searching result. The result contains three elements: `best_start_time`, `total_conflict_time` (indicating the summed conflict time of all users), and `total_conflict_members`(indicating number of users that will be in schedule conflict). The optimization goal of this API is to minimize the `total_conflict_time` value.
``` python
# An example of usage
find_slot = {
    'start_time': get_time(2022,12,10).isoformat(),
    'end_time': get_time(2022,12,11).isoformat(),x
    'duration': 180,
    'start_index': 0,
    'end_index': 9
}
response = requests.post('http://localhost:8000/api/scheduler/findslot/', headers=headers, data=find_slot)
print_resp(response)

# Printed result
# since we specify start_index = 0 and end_index = 9, the return list contains 9 choices.
status: 200
content: [
  [
    "2022-12-10T11:30:00Z",
    "0.0",
    0
  ],
  [
    "2022-12-10T12:30:00Z",
    "0.0",
    0
  ],
  [
    "2022-12-10T13:30:00Z",
    "0.0",
    0
  ],
  [
    "2022-12-10T14:30:00Z",
    "0.0",
    0
  ],
  [
    "2022-12-10T15:30:00Z",
    "0.0",
    0
  ],
  [
    "2022-12-10T16:30:00Z",
    "0.0",
    0
  ],
  [
    "2022-12-10T17:30:00Z",
    "0.0",
    0
  ],
  [
    "2022-12-10T18:00:00Z",
    "0.0",
    0
  ],
  [
    "2022-12-10T07:30:00Z",
    "5400.0",
    3
  ]
]
```

**[GET] /scheduler/invitecode/{calendar_id}/**
This API is reponsible for generating an `invite_code` of a given calendar
- Input: A `header` contains the token of the current user. 
- Returns: It returns a `200` OK response, with a serializer containing four elements: `id` of the calendar, generated `invite_code`, `members` and `guests` (their mail addresses) of the calendar.
```python
# An example of usage
response = requests.get(f'http://localhost:8000/api/scheduler/invitecode/{calendar_id}/', headers=headers)
print_resp(response)

# Printed result
status: 200
content: {
  "id": 154,
  "invite_code": "LI9NxxiykT",
  "members": [
    "user3@test.com"
  ],
  "guests": []
}

# An example of adding guest
invite_code = response.json()['invite_code']
guests = response.json()['guests']
guests.append('user2@test.com')  # Add one guest
```

**[PUT] /scheduler/invitecode/{calendar_id}/**
This API is reponsible for generating an `invite_code` of a given calendar
- Input: A `header` contains the token of the current user. 
- Returns: It returns a `200` OK response, with a serializer containing four elements: `id` of the calendar, generated `invite_code`, `members` and `guests` (their mail addresses) of the calendar.
```python
# An example of usage
response = requests.get(f'http://localhost:8000/api/scheduler/invitecode/{calendar_id}/', headers=headers)
print_resp(response)

# Printed result
status: 200
content: {
  "id": 154,
  "invite_code": "LI9NxxiykT",
  "members": [
    "user3@test.com"
  ],
  "guests": []
}

# An example of adding guest
invite_code = response.json()['invite_code']
guests = response.json()['guests']
guests.append('user2@test.com')  # Add one guest
```

**[PUT] /scheduler/invitecode/{calendar_id}/add/**
This API is reponsible for an user to join a specfic calendar by inputting a `invite_code`
- Input: A `header` contains the token of the current user, and a `new_list` serializer containing a one element: `invite_code` of a calendar.
- Returns: Once succeed (`invite_code` matches with calendar), it returns a `200` OK response, with a serializer containing four elements: `id` of the calendar, `invite_code`, `members` and `guests` (their mail addresses) of the calendar; if not succeed, it will return an serializer containing `Failed` token. 
```python
# An example of usage
# To simulate the invitcode function, we first logout the current user and login with another user 
response = requests.post(f'http://localhost:8000/api/account/logout/', headers=headers)
print(f"status: {response.status_code}")

login_data = {"username":"user2@test.com", "password": "cnmtest2"}
response = requests.post('http://localhost:8000/api/account/login/', json=login_data)
print_resp(response)

# every time we use an API we need to include the headers containing authorization information
headers = {
    "authorization": f"Token {dict(response.json()).get('token')}"
}

# we include the invite_code we obtained in new_list
new_list = {'invite_code': invite_code}
new_list['test'] = 'test'
response = requests.put(f'http://localhost:8000/api/scheduler/invitecode/{calendar_id}/add/', headers=headers, json=new_list)
print_resp(response)

# Printed result
status: 200
content: {
  "id": 201,
  "invite_code": "IlQH7ZZ4BB",
  "members": [
    "user2@test.com",
    "user3@test.com"
  ],
  "guests": []
}
```

**[PUT] /scheduler/invitecode/{calendar_id}/**
This API is reponsible for updating `invite_code` of an existing calendar
- Input: A `header` contains the token of the current user, a new_list containing three elements: `invite_code`, `members`, and `guests`, if you set `invite_code` to be `"new code"`, it will serve as a flag to inform backend to update the `invide_code`; otherwise, the `invite_code` will not be updated.
- Returns: It returns a `200` OK response, with a serializer containing four elements: `id` of the calendar, updated `invite_code`, `members` and `guests` (their mail addresses) of the calendar
```python
# An example of usage
new_list['invite_code'] = "new code"  
new_list['members'] = []
new_list['guests'] = guests
response = requests.put(f'http://localhost:8000/api/scheduler/invitecode/{calendar_id}/', headers=headers, json=new_list)
print_resp(response)

# Printed result
status: 200
content: {
  "id": 201,
  "invite_code": "UW7TkGxebW", # here the invite_code has been updated
  "members": [],
  "guests": [
    "user2@test.com"
  ]
}
```

