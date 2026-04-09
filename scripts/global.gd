extends Node

# Hair color sprite collection
var hairC_collection = {
	"none" : null,
	"01" : preload("res://assets/character_sprite/hair/color/Hair1T.png")
}

# Hair outline sprite collection
var hairO_collection = {
	"none" : null,
	"01" : preload("res://assets/character_sprite/hair/outline/Hair1.png")
}

# Torso color sprite collection
var torsoC_collection = {
	#"none" : null,
	"01" : preload("res://assets/character_sprite/body/torso/color/Top7C_T.png")
}
# Torso outline sprite collection
var torsoO_collection = {
	#"none" : null,
	"01" : preload("res://assets/character_sprite/body/torso/outline/Top7_T.png")
}

# Left arm color sprite collection
var leftArmC_collection = {
	#"none" : null,
	"01" : preload("res://assets/character_sprite/body/left_arm/color/Top7C_L.png")
}
# Left arm outline sprite collection
var leftArmO_collection = {
	#"none" : null,
	"01" : preload("res://assets/character_sprite/body/left_arm/outline/Top7_L.png")
}

# Right arm color sprite collection
var rightArmC_collection = {
	#"none" : null,
	"01" : preload("res://assets/character_sprite/body/right_arm/color/Top7C_R.png")
}
# Right arm outline sprite collection
var rightArmO_collection = {
	#"none" : null,
	"01" : preload("res://assets/character_sprite/body/right_arm/outline/Top7_R.png")
}


# Leg color sprite collection
var legC_collection = {
	#"none" : null,
	"01" : preload("res://assets/character_sprite/body/legs/color/Bottom1C.png")
}
# Leg outline sprite collection
var legO_collection = {
	#"none" : null,
	"01" : preload("res://assets/character_sprite/body/legs/outline/Bottom1.png")
}

# Skintones
var body_colors = [
	Color(0.96, 0.80, 0.69),
	Color(0.72, 0.54, 0.39),
	Color(0.45, 0.34, 0.27),
]

# Hair Colors
var hair_colors = [
	Color(0.1, 0.1, 0.1),
	Color(0.4, 0.2, 0.1),
	Color(0.9, 0.6, 0.2),
	Color(0.5, 0.25, 0),
]

# Outfits and Accessory colors
var colors = [
	Color(1, 1, 1), # Default
	Color(1, 0, 0),
	Color(0, 1, 0),
	Color(0, 0, 1),
	Color(0, 0, 0),
	Color(1, 1, 1),
]

# Selected Values
var selected_hair = ""
var selected_outfit = ""
var selected_legs = ""
var selected_body_color = ""
var selected_hair_color = ""
var selected_outfit_color = ""
var selected_legs_color = ""
