# Groupomania

MVP for Groupomania Social Network.

## Technologies

-   Node, Express
-   Database : MySQL
-   Backend : Sequelize
-   Frontend : Axios, VueJS 3, Vuex, Vue Router, PrimeVue

## Create database 'groupo'

-   MySQL server must be installed.
-   Replace _user_name_ by the name of the user in instructions below.
-   Use the file database.sql.
-   Connect to your MySQL server (the path is like MySQL/"MySQL Server 8.0"/bin) on your operating terminal :

```
...bin>mysql -u *user_name* -p<*path of the file database.sql*
```

-   Type your password

**OR**

```
...bin>mysql -u *user_name* -p
```

-   Type your password

```
mysql>*path of the file database.sql*
```

## Customize configuration

Fill datas (except ID_ADMIN) in .env_sample file
Rename the file to .env

## From the project folder, type :

```
cd frontend
npm install
npm run serve
```

## From the project folder, type :

```
cd backend
npm install
npm node server

```

## Add administrator account :

-   On application, create a new account with datas of administrator
-   On operating terminal, type :

```
mysql>USE groupo;
mysql>SELECT * from users;
```

-   Read the id of administrator account

```
mysql>UPDATE users SET isAdmin=1 WHERE id=*id_of_admin*
```

-   Complete the file **.env** with id of administrator account.
