# USER

## CREATING AN ACCOUNT

`[POST] /users/create`

```JSON
{
  "email":"",
  "password":""
}
```

##### [RESPONSE]

```JSON
{
  "email":"",
  "id":"",
  "key":"",
  "createdAt":"",
  "updatedAt":""
}
```

## LOGGING INTO YOUR ACCOUNT

`[POST] /users/login`

```JSON
{
  "email":"",
  "password":""
}
```

##### [RESPONSE]

```JSON
{
  "email":"",
  "id":"",
  "key":"",
  "createdAt":"",
  "updatedAt":""
}
```

## DELETING AN ACCOUNT

`[DELETE] /users?key`

## FIND A USER

`[GET] /users/:id`

##### [RESPONSE]

```JSON
{
  "email":"",
  "id":"",
}
```

## UPDATING A USER

`[POST] /users/update?key`

```JSON
{
  "email":"",
  "password":""
}
```

##### [RESPONSE]

```JSON
{
  "email":"",
  "id":"",
}
```

# TODOS

## CREATE A TODO

`[POST] /todos?key`

```JSON
{
  "description":"",
}
```

##### [RESPONSE]

<!-- check if the user is populated or userId is returned -->

```JSON
{
  "id":"",
  "todo":"",
  "completed":false,
  "createdAt":"",
  "updatedAt":"",
}
```

## FETCH ALL TODOS

`[GET] /todos?key`

##### [RESPONSE]

```JSON
{
  "todos":[
    {
      "id":"",
      "todo":"",
      "completed":false,
      "createdAt":"",
      "updatedAt":"",
    }
  ],
  "owner":{
    "id":"",
    "email":""
  }
}
```

## FETCH A TODO

`[GET] /todos/:id?key`

##### [RESPONSE]

```JSON
  {
    "id":"",
    "todo":"",
    "completed":false,
    "createdAt":"",
    "updatedAt":"",
    "user":{
      "id":"",
      "email":""
    }
  }
```

## UPDATE TODO

`[POST] /todos/:id?key`

```JSON
  {
    "todo":"",
    "completed":false,
  }
```

##### [RESPONSE]

```JSON
  {
    "id":"",
    "todo":"",
    "completed":false,
    "createdAt":"",
    "updatedAt":"",
    "userId":""
  }
```

## DELETE TODO

`[DELETE] /todos/:id?key`
