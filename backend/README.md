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

### Developing Instructions

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

