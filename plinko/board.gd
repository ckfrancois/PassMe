extends Node2D
class_name Board

@onready var ball_scene:PackedScene = preload("res://Ball.tscn")

@export var ball:Ball = null
@export var spawn_point:Vector2 = Vector2(0,0)

func _ready() -> void:
	pass
