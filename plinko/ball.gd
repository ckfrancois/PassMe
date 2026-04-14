extends RigidBody2D

var stopped = false

func _ready():
	gravity_scale = 0
	linear_velocity = Vector2(500, 0)
	
func _input(event):
	if event is InputEventScreenTouch and event.is_pressed():
		linear_velocity.x = 0
		stopped = true
		gravity_scale = 1
 
func _physics_process(delta: float) -> void:
	if stopped:
		return
	
	var screenWidth = get_viewport().get_visible_rect().size.x
	
	if position.x <= 0:
		linear_velocity.x = abs(linear_velocity.x)
		
	if position.x >= screenWidth:
		linear_velocity.x = -abs(linear_velocity.x)
		
	linear_velocity.x = sign(linear_velocity.x) * 500
