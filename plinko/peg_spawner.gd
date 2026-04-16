extends Node2D
class_name PegSpawner

@export var peg_scene: PackedScene = preload("res://Peg.tscn")

@export var border_left: StaticBody2D
@export var border_right: StaticBody2D

@export var starting_y: float = 400

@export var rows: int = 10
@export var vertical_spacing: float = 100.0

@export var ball_radius: float = 320.0
@export var extra_padding: float = 8.0

var play_width: float
var spacing: float
var columns: int


func _ready() -> void:
	
	play_width = abs(border_right.global_position.x - border_left.global_position.x)
	
	var goal_details = _calculate_goals_needed()
	spacing = goal_details.x
	columns = goal_details.y
	spawn_pegs()


# Same math as GoalsManager so everything aligns
func _calculate_goals_needed() -> Vector2i:
	var ball_diameter = ball_radius * 2.0
	
	# Minimum safe gap between objects
	var min_gap = ball_diameter + extra_padding
	
	# Total width one "slot" takes (goal + gap)
	var slot_width = Global.goal_size_x + min_gap
	
	# How many fit across the play area
	var number_of_goals = int(play_width / slot_width)
	
	# Prevent too few goals
	number_of_goals = max(number_of_goals, 5)
	
	# Recalculate exact spacing so everything fills nicely
	var spacing = (play_width - Global.goal_size_x * number_of_goals) / number_of_goals
	
	return Vector2i(int(spacing), number_of_goals)


func spawn_pegs() -> void:
	var start_x = border_left.global_position.x
	
	var horizontal_spacing = Global.goal_size_x + spacing
	print(columns)
	for row in range(rows):
		for col in range(columns):
			
			
			var peg = peg_scene.instantiate()
			
			var offset_x = 0.0
			if row % 2 == 1:
				offset_x = horizontal_spacing / 2.0
			
			var x = start_x + col * horizontal_spacing + offset_x
			var y = starting_y + row * vertical_spacing
			
			# Keep inside borders
			if x > border_left.global_position.x and x < border_right.global_position.x:
				peg.global_position = Vector2(x, y)
				add_child(peg)
				print("jsfdf")
