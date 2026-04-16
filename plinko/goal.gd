extends Area2D
class_name Goal

@export var col_shape:CollisionShape2D = null
@export var reward:int = 1:
	set(new_value):
		reward = new_value
		$Label.text = "Coins: " + str(reward)

func _ready() -> void:
	# Design shape to follow Global variables
	var shape:RectangleShape2D = RectangleShape2D.new()
	shape.size.x = Global.goal_size_x
	shape.size.y = Global.goal_size_y
	col_shape.shape = shape
	area_entered.connect(_handle_ball_in_goal)
	$Label.text = "Coins: " + str(reward)

# Handle the ball falling into the goal
func _handle_ball_in_goal(area:Area2D) -> void:
	(area.get_child(0) as CollisionShape2D).set_deferred("disabled", true)
	print(area)
	print(area.get_parent())
