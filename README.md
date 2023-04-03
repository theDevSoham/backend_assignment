
# Backend Assignment

A test given by Reunion co. for Backend Developer Position. The following app is a Social media backend mockup, where different api endpoints are exposed for various user actions. 


## API Reference

#### Login

```bash
  POST /api/authenticate
```

| Body | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `email` | `string` | **Required**. Email of the user |
| `password` | `string` | **Required**. Relative password |

Returns JWT token


#### Follow Request

```bash
  POST /api/follow/{id}
```

| Header | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `Authorization` | `string` | **Required**. Bearer token |

Authenticated user would follow user with {id}

#### Unfollow Request

```bash
  POST /api/unfollow/{id}
```

| Header | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `Authorization` | `string` | **Required**. Bearer token |

Authenticated user would unfollow user with {id}

#### Get Authenticated User

```bash
  GET /api/user
```

| Header | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `Authorization` | `string` | **Required**. Bearer token |

Returns User Name, number of followers & followings.

#### Add a new post created by the authenticated user.

```bash
  POST /api/posts/
```

| Header | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `Authorization` | `string` | **Required**. Bearer token |

| Body | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `title` | `string` | **Required**. The title of the post |
| `description` | `string` | **Required**. The description of the post |

Return Post-ID, Title, Description, Created Time(UTC).

#### Delete Post

```bash
  DELETE /api/posts/{id}
```

| Header | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `Authorization` | `string` | **Required**. Bearer token |

Delete post with {id} created by the authenticated user.

#### Like a post

```bash
  POST /api/like/{id}
```

| Header | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `Authorization` | `string` | **Required**. Bearer token |

Like the post with {id} by the authenticated user.

#### Unlike a post

```bash
  POST /api/unlike/{id}
```

| Header | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `Authorization` | `string` | **Required**. Bearer token |

Unlike the post with {id} by the authenticated user.

#### Add a comment

```bash
  POST /api/comment/{id}
```

| Header | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `Authorization` | `string` | **Required**. Bearer token |

| Body | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `comment` | `string` | **Required**. The comment text |

Add comment for post with {id} by the authenticated user. Returns Comment-ID.

#### Return a single post

```bash
  GET /api/posts/{id}
```

| Header | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `Authorization` | `string` | **Required**. Bearer token |


Returns a single post with {id} populated with its number of likes and comments.

#### Return all posts

```bash
  GET /api/all_posts
```

| Header | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `Authorization` | `string` | **Required**. Bearer token |


- RETURN: For each post return the following values
    - id: ID of the post
    - title: Title of the post
    - desc: Description of the post
    - created_at: Date and time when the post was created
    - comments: Array of comments, for the particular post
    - likes: Number of likes for the particular post





## Installation

Install this project with git clone [repo_link](https://github.com/theDevSoham/backend_assignment.git)

```bash
  npm install
  npm start
```
## Environment Variables

To run this project, you will need to add the following environment variables to your .env file. If docker is used, no need to do so.

- `JWT_KEY`
- `MONGO_PASSWORD`
- `MONGO_URL`


## Running Tests

To run tests, run the following command

```bash
  npm run test
```


## Deployed link

The project is live at [render](https://backend-assignment-dv5o.onrender.com)


## License

[MIT](https://choosealicense.com/licenses/mit/)


## Acknowledgements

 - [Awesome Readme Templates](https://awesomeopensource.com/project/elangosundar/awesome-README-templates)
 - [Awesome README](https://github.com/matiassingers/awesome-readme)
 - [How to write a Good readme](https://bulldogjob.com/news/449-how-to-write-a-good-readme-for-your-github-project)

