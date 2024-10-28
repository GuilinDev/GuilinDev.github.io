---
layout: post
permalink: Python-Cheatsheet-2024
---

## Data Types 数据类型
### Integers 整数
Integers are whole numbers. 整数是整数。
```python
my_number = 354
```
### Floating Point Numbers 浮点数
Floats are numbers with decimal places.
When you do a calculation that results in
a fraction e.g. 4 ÷ 3 the result will always be
a floating point number.
```python
my_float = 3.14159
```
### Strings 字符串
A string is just a string of characters.
It should be surrounded by double quotes.
```python
my_string = "Hello"
``` 
### String Concatenation 字符串连接
You can add strings to string to create
a new string. This is called concatenation.
It results in a new string.
```python
"Hello" + "Angela"
#becomes "HelloAngela"
```
### Escaping a String 转义字符串
Because the double quote is special, it
denotes a string, if you want to use it in
a string, you need to escape it with a "\"
```python
speech = "She said: \"Hi\""
print(speech)
#prints: She said: "Hi"
```

### F-Strings F-字符串
You can insert a variable into a string
using f-strings.
The syntax is simple, just insert the variable
in-between a set of curly braces {}.
```python
days = 365
print(f"There are {days} in a year")
···

### Converting Data Types 转换数据类型
You can convert a variable from 1 data type to another.
Converting to float:
float()
Converting to int:
int()
Converting to string:
str()