extends Node2D
class_name Goals

@export var goal_scene:PackedScene = preload("res://Goal.tscn")

@export var starting_spawn:Vector2 = Vector2(54,1650)

@export var border1:StaticBody2D = null
@export var border2:StaticBody2D = null

var distance_between:int = 0

func _ready() -> void:
	distance_between = 1080#abs(border1.global_position.x - border2.global_position.x)
	print(distance_between)
	
	
	var goal_details:Vector2i = _calculate_goals_needed()
	
	spawn_goals(goal_details)

# Takes in the (distance between goals, number of goals)
func spawn_goals(goal_details:Vector2i) -> void:
	for i in range(goal_details.y):
		# Create Goal
		var goal:Goal = goal_scene.instantiate()
		
		# Set Goal position to properly spaced
		goal.global_position.x = starting_spawn.x + Global.goal_size_x*i + goal_details.x*i
		goal.global_position.y = starting_spawn.y
		
		var closeness_value:float = (goal_details.y/2)-(i+1)
		print(closeness_value)
		if closeness_value == 0 or closeness_value == -1:
			goal.reward = 5
		if closeness_value == 1 or closeness_value == -2:
			goal.reward = 3
		
		# Only make borders for all goals but last
		if i != goal_details.y-1:
			# Create Borders and shape
			var border:StaticBody2D = StaticBody2D.new()
			var col_shape:CollisionShape2D = CollisionShape2D.new()
			var shape:RectangleShape2D = RectangleShape2D.new()
			
			# Create the proper Shape
			shape.size.x = goal_details.x
			shape.size.y = Global.goal_size_y * 1.8
			col_shape.shape = shape
			
			# Get the position Correct between the goals
			border.global_position.x = starting_spawn.x + Global.goal_size_x*i + goal_details.x*i + Global.goal_size_x/2 + goal_details.x/2
			border.global_position.y = starting_spawn.y 
			
			# Add Border to scene
			border.add_child(col_shape)
			add_child(border)
		
		# Add goal to scene
		add_child(goal)
		


# Returns the (distance between goals, number of goals)
func _calculate_goals_needed() -> Vector2i:
	var x:float = 0.0
	var dist_between_goals:int = 0
	var number_of_goals:int = 0
	for i:float in range(10, 20):
		x = (distance_between-Global.goal_size_x*i)/i

		if int(x) == x and x > 0:
			print("Distance Between: ", x, " Number of Slots: ", i)
			dist_between_goals = x
			number_of_goals = i
	
	return Vector2i(dist_between_goals, number_of_goals)
