---
title: "Intro to Relational Databases"
description: ""
author: "John Paul"
date: "2018-09-20"
tags: ["python", "programming"]
---

# Introduction: Data and Tables

How computers structure data:

1. In memory:

   - As simple variables such as numbers, strings, etc.
   - As data structures such as lists, dictionaries, objects
   - such data is volatile and only exists temporarily.

2. Durable storage:
   - As flat files on disks e.g. text, xml, JSON (durable)
   - In Databases.
     - Such data may take the form of:
       - key-value stores
       - Navigational DBs
       - Relational DBs
     - Some advantages of storing data in databases:
       - Faster and easier searches.
       - Concurrency - multiple programs/users can access/modify data at the same time without undoing others' changes.
       - Flexible query language
         - summarizing data, doing comparisons, finding connections between related pieces.
         - constraints - rules for protecting the consistency of data.

# Data Types and Meaning

Row - contains same sort of data about a _thing_.

Types - String, Numeric etc.

Every column in a DB will have some type associated with it.

All values in the column will be of the same type and have same kind of meaning.

# Anatomy of a table

A table has a **name**.

Table name + name and types of columns make up a **table header.**

A **table body** consists of rows.

# Aggregations

Involve computation of a single result from a set of values e.g. summarizing multiple rows into a single row.

Types of aggregations:

- count
- avg (average)
- sum
- max
- min

# Queries

We define the kind of data we want from a database using a query language.

We get access to a database through a **Database server** or a **Database library**. The Database library typically keeps the database on a local disk. An example is `Sqlite`.

Various **Database servers** exist key among them being `mysql`, `postresql`, `oracle` among others.

# Database

Has several tables in it.

The tables store different information.

We can use **joins** to get results from more than one table. Here, a new table is derived by linking existing tables.

# Uniqueness and Keys

keys should allways be unique.

An example `SQL` statement used to **join** tables:

```sql
select animals.name, animals.species, diet.food from animals join diet on animals.species = diet.species where food = 'fish';
```

This statement joins `animal` and `diet` tables using **species** as the match (selects any rows where food = 'fish').

# Elements of SQL

## Data Types

- boolean: use **boolean** or **bool** to declare a true or false value.
- character values
  - char
  - char(n): holds n number of characters
  - varchar(n): holds a maximum of n characters
  - text: a string of any length
- integer values
  - smallint: between -32768 and 32767
  - int: between -214783648 and 214783647
  - serial: auto-populated
- floating-point values
  - float(n): has n points of precision
  - real: 8-byte floating point number
  - numeric(n, m): has n digits and m digits after decimal
- date and time values
  - date
  - time
  - timestamp: date and time
  - timestamptz: timestamp with timezone
  - interval: difference between two timestamps
- geometric data
  - point: pairs of coordinates
  - line: set of points that map out a line

Always put character values and date and time values in single quotes.

To get data from a database, we use select statements.

```sql
select <columns> from <tables> where <condition>;
```

Columns are separated by commas; use \*\*\*\* to select all columns.

The condition is a Boolean expression on column values. SQL supports the Boolean operations **and**, **or**, and **not** which work the same as in Python.

An example SQL statement:

```sql
select name from animals where (not species = 'gorilla') and (not name = 'max');
```

The above statement selects all animals that are not named 'max' and whose species is not 'gorilla'. Reads almost like English.

SQL also supports comparison operators. They include: `< > <= >= != =(equality)`.

The statement below makes use of comparison operators to find all the llamas born between 1995 and 1998.

```sql
select name from animals where species = 'llamas' and birthdate >= '1995-01-01' and birthdate <= '1998-12-31';
```

SQL does not provide a standard way of informing us what tables there are in a database or what columns there are in a table. The different database systems provide their own ways of doing this. For example:

- Postgresql: `\dt`(table info) and `\d <tablename>`(columns)
- MySQL: `show tables` and `describe <tablename>`.
- SQLite: `.tables` and `.schema <tablename>`

**Select** statements have several modifiers. These modifiers are called **select clauses**. We have already seen one such clause in **where** (for expressing restrictions/filtering a table for rows that follow a particular rule). Other examples include:

- **limit** _n_ : returns the first n rows of the table.
- **limit** _n_ **offset** _m_: returns n rows starting after the first m rows.
- **order by** _columns_: sort rows using columns as sort key.
- **order by** _columns_ **desc**: sort in descending order(largest to smallest).
- **group by** _columns_: only used with aggregations. Changes behavior of aggregations(max, count and sum). The aggregation returns one row for each distinct column in columns. Without a **group by** clause, a select statement with an aggregation will aggregate over the whole selected table(s), returning only one row. With **group by**, it will return one row for each distinct value of the column or expression in the **group by** clause.

We may use the above clauses as follows:

- `... limit 10 offset 100`: return 10 rows starting with the 151st.
- `... order by species, name`: sort result row first by the species column, then within each species sort by the name column.
- `select species, min(birthdate) from animals group by species`: for each species of animal, find the smallest value of the birthdate column.

Form the habit of doing restrictions and aggregations in the database instead of in your code. It is much faster.

## Adding Rows to a Table

To add a row, we use the `Insert` statement. It follows the below syntax.

```sql
insert into table (column1, column2,...) values (val1, val2, ...);
```

If the values are in the same order as the table's columns (starting with the first column), you don't have to specify the columns in the insert statement:

```sql
insert into table values ( val1, val2, ... );
```

A single insert statement can only insert into a single table. (Contrast this with the select statement, which can pull data from several tables using a join.)

## Joining tables

To join two tables, first choose the join condition, or the rule you want the database to use to match rows from one table up with rows of the other table. Then write a join in terms of the columns in each table.

For instance, if you want to join tables T and S by matching rows where T.color is the same as S.paint, you'd write a select statement using **T join S on T.color = S.paint**.

## Having clause

The **having clause** acts like the **where** clause but it applies after **group by** aggregations take place. It filters the results table after all aggregations whereas _where_ filters the source table. The syntax goes as follows:

```sql
select columns from tables group by column having condition;
```

At least one of the columns will be an aggregate function on one of the table's columns. To apply **having** on an aggregated column, you will want to give it a name using **as**.

Let's see an example:

```sql
select name, count(*) as num from sales having num > 5;
```

## Python DB-API

How to connect Python code to an SQL database.
The **Python DB-API** is a standard for Python libraries that let your code connect to a database.

Different libraries exist for different database systems.

The standard specify what functions you will call to connect to a database - to send a query or get results

Learning DB-API functions will allow to apply such knowledge to any database system.

Each database system has its own library. A few common ones are summarized below.

| Database System | DB-API Module   |
| --------------- | --------------- |
| SQLite          | sqlite3         |
| PostgreSQL      | psycopg2        |
| MySQL           | mysql.connector |
| ODBC            | pyodbc          |

<br/>
Every time you use a **DB-API** from your code, you'll generally have to follow some typical steps. Lets examine them from the context of the *sqlite3* library.

```python
import sqlite3
# This is the library for the DB we're using. For PostgreSQL, we'd
# have imported psycopg2

conn = sqlite3.connect("Cookies")
# Connects to a database. If the connection is over a network,
# you'll need to provide params such as hostname, username,
# password, etc...
# Returns a connection object which is good till you close the
# connection.

cursor = conn.cursor()
# Next we create a cursor. The cursor runs queries and fetches results.
# Scans through the results from the DB hence the name cursor.

cursor.execute("select host_key from cookies limit 10")
# use cursor to execute a query.
results = cursor.fetchall()
# fetch the results from query using cursor.
# You could use 'fetchone()' here to fetch results one at a time.

# If the query was an insert, we'd need to commit the insertion.
print results

conn.close() # close the connection when done.
```

## Inserts in DB-API

When we make inserts (or any changes for that matter), they go into a **transaction** in a DB.

When we call commit, the transaction takes effect. Changes are rolled back if we close the connection without committing. This principle is called **atomicity**. Atomicity means that either a change happens as a whole, atomically, or it doesn't happen at all.

Check out the following code snippet.

```python
import sqlite3

db = sqlite3.connect()

c = db.cursor()

query = "insert into names values ('Jennifer Smith')"
c.execute(query)

db.commit() # commit method belongs to connection object.
db.close() # close connection
```
