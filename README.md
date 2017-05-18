# Murly analytics API

Rest API to access Murly analytics data.

## Development

```
npm i
npm start
```

# Usage

You can filter navigations by a date range

```
http://localhost:8000/api/v1/navigations/createAt/2017-04-20/2017-04-20?page=1
```


And you can add a project id also, to filter by just on project (the project id is the one on murly database):

```
http://localhost:8000/api/v1/navigations/createAt/2017-04-20/2017-04-20/PROJECT_ID?page=1
```