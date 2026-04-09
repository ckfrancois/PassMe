extends Node2D

@onready var leftArmC_sprite = $LeftArm/Base_Color
@onready var leftArmO_sprite = $LeftArm/Base_Outline
@onready var rightArmC_sprite = $RightArm/Base_Color
@onready var rightArmO_sprite = $RightArm/Base_Outline
@onready var torsoC_sprite = $Torso/Base_Color
@onready var torsoO_sprite = $Torso/Base_Outline
@onready var headC_sprite = $Head/Base_Outline
@onready var headO_sprite = $Head/Base_Outline

# Keys
var body_keys = []
var body_color_keys = []
var outfit_keys = []
var outfit_color_keys = []
var current_outfit_index = 0
var current_color_index = 0

func _ready():
	set_sprite_keys()
	update_sprite()

func set_sprite_keys():
	outfit_keys = 1

# Update textures and modulate
func update_sprite():
	#var curernt_sprite = body_color_keys[current_body_index]
	leftArmC_sprite.modulate = Global.body_color_options[current_color_index]
	rightArmC_sprite.modulate = Global.body_color_options[current_color_index]
	torsoC_sprite.modulate = Global.body_color_options[current_color_index]
	headC_sprite.modulate = Global.body_color_options[current_color_index]
	
	Global.selected_body_color = Global.body_color_options[current_color_index]
