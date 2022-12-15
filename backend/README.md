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
