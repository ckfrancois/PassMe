extends Node2D

@onready var leftArmC_sprite = $LeftArm/Outfit_Color
@onready var leftArmO_sprite = $LeftArm/Outfit_Outline
@onready var rightArmC_sprite = $RightArm/Outfit_Color
@onready var rightArmO_sprite = $RightArm/Outfit_Outline
@onready var torsoC_sprite = $Torso/Outfit_Color
@onready var torsoO_sprite = $Torso/Outfit_Outline
@onready var headC_sprite = $Head/Outfit_Color
@onready var headO_sprite = $Head/Outfit_Outline

@onready var eye_sprite = $Head/Eyes
@onready var noseC_sprite = $Head/Nose/Color
@onready var noseO_sprite = $Head/Nose/Outline
@onready var mouth_sprite = $Head/Mouth

@onready var leftArmBase_sprite = $LeftArm/Base_Color
@onready var rightArmBase_sprite = $RightArm/Base_Color
@onready var torsoBase_sprite = $Torso/Base_Color
@onready var headBase_sprite = $Head/Base_Color
@onready var legBase_sprite = $Legs/Base_Color

@onready var legC_sprite = $Legs/Outfit_Color
@onready var legO_sprite = $Legs/Outfit_Outline

@onready var shoeC_sprite = $Legs/Shoes/Outfit_Color
@onready var shoeO_sprite = $Legs/Shoes/Outfit_Outline

# Buttons
@export var eyes_buttons: ButtonGroup
@export var nose_buttons: ButtonGroup
@export var mouth_buttons: ButtonGroup
@export var body_buttons: ButtonGroup
@export var outfit_buttons: ButtonGroup
@export var outfit_color_buttons: ButtonGroup
@export var leg_buttons: ButtonGroup
@export var leg_color_buttons: ButtonGroup

# Keys
var eye_keys = []
var nose_keys = []
var mouth_keys = []
var outfit_keys = []
var leg_keys = []
var shoe_keys = []

var current_body_index = 0
var current_eye_index = 0
var current_mouth_index = 0

var current_nose_index = 0
var current_nose_color_index = 0

var current_outfit_index = 0
var current_outfit_color_index = 0

var current_leg_index = 0
var current_leg_color_index = 0

var current_shoe_index = 0
var current_shoe_color_index = 0

func _ready():
	set_sprite_keys()
	update_body_sprite()
	update_eye_sprite()
	update_nose_sprite()
	update_mouth_sprite()
	update_outfit_sprite()
	update_leg_sprite()
	update_shoe_sprite()
	eyes_buttons.pressed.connect(_on_eye_group_pressed)
	nose_buttons.pressed.connect(_on_nose_group_pressed)
	mouth_buttons.pressed.connect(_on_mouth_group_pressed)
	body_buttons.pressed.connect(_on_body_group_pressed)
	outfit_buttons.pressed.connect(_on_outfit_group_pressed)
	outfit_color_buttons.pressed.connect(_on_outfit_color_group_pressed)
	leg_buttons.pressed.connect(_on_leg_group_pressed)
	leg_color_buttons.pressed.connect(_on_leg_color_group_pressed)
	#print(str("Buttons in Group array include: ", eyes_buttons.get_buttons()))

func set_sprite_keys():
	outfit_keys =  Global.torsoO_collection.keys()
	leg_keys = Global.legO_collection.keys()
	shoe_keys = Global.shoeO_collection.keys()
	eye_keys = Global.eye_collection.keys()
	nose_keys = Global.noseO_collection.keys()
	mouth_keys = Global.mouth_collection.keys()
	
# Modulate for skintone
func update_body_sprite():
	leftArmBase_sprite.modulate = Global.body_colors[current_body_index]
	rightArmBase_sprite.modulate = Global.body_colors[current_body_index]
	torsoBase_sprite.modulate = Global.body_colors[current_body_index]
	headBase_sprite.modulate = Global.body_colors[current_body_index]
	legBase_sprite.modulate = Global.body_colors[current_body_index]
	noseC_sprite.modulate = Global.body_colors[current_body_index]
	
	Global.selected_body_color = Global.body_colors[current_body_index]

# Update eye textures
func update_eye_sprite():
	var current_sprite = eye_keys[current_eye_index]
	eye_sprite.texture = Global.eye_collection[current_sprite]
	
	Global.selected_eye = current_sprite

# Update mouth textures
func update_mouth_sprite():
	var current_sprite = mouth_keys[current_mouth_index]
	mouth_sprite.texture = Global.mouth_collection[current_sprite]
	
	Global.selected_mouth = current_sprite

# Update textures and modulate for nose
func update_nose_sprite():
	var current_sprite = nose_keys[current_nose_index]
	# Change textures of outlines
	noseO_sprite.texture = Global.noseO_collection[current_sprite]
	# Change textures of colors
	noseC_sprite.texture = Global.noseC_collection[current_sprite]
	# Change colors
	noseC_sprite.modulate = Global.body_colors[current_body_index]
	
	#Global.selected_nose_color = Global.colors[current_nose_color_index]
	Global.selected_nose = current_sprite

# Update textures and modulate for outfits
func update_outfit_sprite():
	var current_sprite = outfit_keys[current_outfit_index]
	# Change textures of outlines
	leftArmO_sprite.texture = Global.leftArmO_collection[current_sprite]
	rightArmO_sprite.texture = Global.rightArmO_collection[current_sprite]
	torsoO_sprite.texture = Global.torsoO_collection[current_sprite]
	# Change textures of colors
	leftArmC_sprite.texture = Global.leftArmC_collection[current_sprite]
	rightArmC_sprite.texture = Global.rightArmC_collection[current_sprite]
	torsoC_sprite.texture = Global.torsoC_collection[current_sprite]
	# Change colors
	leftArmC_sprite.modulate = Global.colors[current_outfit_color_index]
	rightArmC_sprite.modulate = Global.colors[current_outfit_color_index]
	torsoC_sprite.modulate = Global.colors[current_outfit_color_index]
	#headC_sprite.modulate = Global.colors[current_color_index]
	
	Global.selected_outfit_color = Global.colors[current_outfit_color_index]
	Global.selected_outfit = current_sprite
	
	#Global.selected_body_color = Global.body_color_options[current_color_index]

# Update textures and modulate for legs
func update_leg_sprite():
	var current_sprite = leg_keys[current_leg_index]
	# Change textures of outlines
	legO_sprite.texture = Global.legO_collection[current_sprite]
	# Change textures of colors
	legC_sprite.texture = Global.legC_collection[current_sprite]
	# Change colors
	legC_sprite.modulate = Global.colors[current_leg_color_index]
	
	Global.selected_legs_color = Global.colors[current_leg_color_index]
	Global.selected_legs = current_sprite

# Update textures and modulate for shoes
func update_shoe_sprite():
	var current_sprite = shoe_keys[current_shoe_index]
	# Change textures of outlines
	shoeO_sprite.texture = Global.shoeO_collection[current_sprite]
	# Change textures of colors
	shoeC_sprite.texture = Global.shoeC_collection[current_sprite]
	# Change colors
	shoeC_sprite.modulate = Global.colors[current_shoe_color_index]
	
	Global.selected_shoe_color = Global.colors[current_shoe_color_index]
	Global.selected_shoe = current_sprite


func _on_color_button_pressed() -> void:
	current_outfit_color_index = (current_outfit_color_index + 1) % Global.colors.size()
	update_outfit_sprite()


func _on_collection_button_pressed() -> void:
	current_outfit_index = (current_outfit_index + 1) % outfit_keys.size()
	update_outfit_sprite()


func _on_legs_button_pressed() -> void:
	current_leg_index = (current_leg_index + 1) % leg_keys.size()
	update_leg_sprite()


func _on_legs_color_button_pressed() -> void:
	current_leg_color_index = (current_leg_color_index + 1) % Global.colors.size()
	update_leg_sprite()


func _on_body_color_button_pressed() -> void:
	current_body_index = (current_body_index + 1) % Global.body_colors.size()
	update_body_sprite()
	


func _on_shoe_button_pressed() -> void:
	current_shoe_index = (current_shoe_index + 1) % shoe_keys.size()
	update_shoe_sprite()


func _on_shoe_color_button_pressed() -> void:
	current_shoe_color_index = (current_shoe_color_index + 1) % Global.colors.size()
	update_shoe_sprite()


func _on_eye_button_pressed() -> void:
	current_eye_index = (current_eye_index + 1) % eye_keys.size()
	update_eye_sprite()

func _on_nose_button_pressed() -> void:
	current_nose_index = (current_nose_index + 1) % nose_keys.size()
	update_nose_sprite()


func _on_mouth_button_pressed() -> void:
	current_mouth_index = (current_mouth_index + 1) % mouth_keys.size()
	update_mouth_sprite()


func _on_eye_group_pressed(button: BaseButton):
	var button_pressed = eyes_buttons.get_pressed_button()
	current_eye_index = int(button_pressed.name) - 1
	update_eye_sprite()
	
func _on_nose_group_pressed(button: BaseButton):
	var button_pressed = nose_buttons.get_pressed_button()
	current_nose_index = int(button_pressed.name) - 1
	update_nose_sprite()

func _on_mouth_group_pressed(button: BaseButton):
	var button_pressed = mouth_buttons.get_pressed_button()
	current_mouth_index = int(button_pressed.name) - 1
	update_mouth_sprite()

func _on_body_group_pressed(button: BaseButton):
	var button_pressed = body_buttons.get_pressed_button()
	current_body_index = int(button_pressed.name) - 1
	update_body_sprite()

func _on_outfit_group_pressed(button: BaseButton):
	var button_pressed = outfit_buttons.get_pressed_button()
	current_outfit_index = int(button_pressed.name) - 1
	# Prevent overall bottoms from being worn on other outfits
	if(current_outfit_index != 5 && current_outfit_index != 4 && current_outfit_index != 3):
		if(current_leg_index == 5):
			current_leg_index = 10
			update_leg_sprite()
		if(current_leg_index == 11):
			current_leg_index = 12
			update_leg_sprite()
	else:
		if(current_leg_index == 10):
			current_leg_index = 5
			update_leg_sprite()
		if(current_leg_index == 12):
			current_leg_index = 11
			update_leg_sprite()
	update_outfit_sprite()

func _on_outfit_color_group_pressed(button: BaseButton):
	var button_pressed = outfit_color_buttons.get_pressed_button()
	current_outfit_color_index = int(button_pressed.name) - 1
	update_outfit_sprite()

func _on_leg_group_pressed(button: BaseButton):
	var button_pressed = leg_buttons.get_pressed_button()
	current_leg_index = int(button_pressed.name) - 1
	# Automatically convert to overall bottoms when wearing overall outfits
	if(current_outfit_index == 5 || current_outfit_index == 4 || current_outfit_index == 3):
		if (current_leg_index == 10):
			current_leg_index = 5
		if (current_leg_index == 12):
			current_leg_index = 11
	update_leg_sprite()

func _on_leg_color_group_pressed(button: BaseButton):
	var button_pressed = leg_color_buttons.get_pressed_button()
	current_leg_color_index = int(button_pressed.name) - 1
	update_leg_sprite()
