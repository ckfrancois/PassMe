extends RigidBody2D

func _ready():
	freeze = true
	
func _input(event):
	if event is InputEventScreenTouch and event.is_pressed():
		freeze = false
