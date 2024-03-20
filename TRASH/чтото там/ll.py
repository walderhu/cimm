from turtle import *
import turtle
import time
import math

ws = turtle.Screen()
ws.bgcolor("black")
ws.setup(width=500, height=500)
ws.tracer(0)
tur = turtle.Turtle()
tur.hideturtle()
tur.speed(0)
tur.pensize(3)
def draw_clock(hour, min, second, tur):
    tur.up()
    tur.goto(0, 210)
    tur.setheading(180)
    tur.color("red")
    tur.pendown()
    tur.circle(210)
    tur.up()
    tur.goto(0, 0)
    tur.setheading(90)
    for _ in range(12):
        tur.fd(190)
        tur.pendown()
        tur.fd(20)
        tur.penup()
        tur.goto(0, 0)
        tur.rt(30)
   
    clockhands = [("yellow", 80, 12), ("green", 150, 60), ("blue", 110, 60)]
    timeset = (hour, min, second)
    for hand in clockhands:
        timepart = timeset[clockhands.index(hand)]
        angle = (float(timepart) / hand[2])*360
        tur.penup()
        tur.goto(0, 0)
        tur.color(hand[0])
        tur.setheading(90)
        tur.rt(angle)
        tur.pendown()
        tur.fd(hand[1])
while True:
    hour = int(time.strftime("%I"))
    min = int(time.strftime("%M"))
    second = int(time.strftime("%S"))
    draw_clock(hour, min, second, tur)
    ws.update()
    time.sleep(1)
    tur.clear()
#window.mainloop()