extends Node

# Hair color sprite collection
var hairC_collection = {
	"none" : null,
	"01" : preload("res://assets/character_sprite/hair/color/Hair1C.png"),
}

# Hair outline sprite collection
var hairO_collection = {
	"none" : null,
	"01" : preload("res://assets/character_sprite/hair/outline/Hair1.png"),
}

# Torso color sprite collection
var torsoC_collection = {
	#"none" : null,
	"01" : preload("res://assets/character_sprite/body/torso/color/Top1C_T.png"),
	"02" : preload("res://assets/character_sprite/body/torso/color/Top2C_T.png"),
	"03" : preload("res://assets/character_sprite/body/torso/color/Top3C_T.png"),
	"04" : preload("res://assets/character_sprite/body/torso/color/Top4C_T.png"),
	"05" : preload("res://assets/character_sprite/body/torso/color/Top5C_T.png"),
	"06" : preload("res://assets/character_sprite/body/torso/color/Top6C_T.png"),
	"07" : preload("res://assets/character_sprite/body/torso/color/Top7C_T.png"),
	"08" : preload("res://assets/character_sprite/body/torso/color/Top8C_T.png"),
	"09" : preload("res://assets/character_sprite/body/torso/color/Top9C_T.png"),
	"10" : preload("res://assets/character_sprite/body/torso/color/Top10C.png"),
	"11" : preload("res://assets/character_sprite/body/torso/color/Top11C.png"),
	"12" : preload("res://assets/character_sprite/body/torso/color/Top12C.png"),
	"13" : preload("res://assets/character_sprite/body/torso/color/Top13C.png"),
	"14" : preload("res://assets/character_sprite/body/torso/color/Top14C_T.png"),
	"15" : preload("res://assets/character_sprite/body/torso/color/Top15C_T.png"),
	"16" : preload("res://assets/character_sprite/body/torso/color/Top16C_T.png"),
	"17" : preload("res://assets/character_sprite/body/torso/color/Top17C_T.png"),
	"18" : preload("res://assets/character_sprite/body/torso/color/Top18C_T.png"),
	"19" : preload("res://assets/character_sprite/body/torso/color/Top19C_T.png"),
}
# Torso outline sprite collection
var torsoO_collection = {
	#"none" : null,
	"01" : preload("res://assets/character_sprite/body/torso/outline/Top1_T.png"),
	"02" : preload("res://assets/character_sprite/body/torso/outline/Top2_T.png"),
	"03" : preload("res://assets/character_sprite/body/torso/outline/Top3_T.png"),
	"04" : preload("res://assets/character_sprite/body/torso/outline/Top4_T.png"),
	"05" : preload("res://assets/character_sprite/body/torso/outline/Top5_T.png"),
	"06" : preload("res://assets/character_sprite/body/torso/outline/Top6_T.png"),
	"07" : preload("res://assets/character_sprite/body/torso/outline/Top7_T.png"),
	"08" : preload("res://assets/character_sprite/body/torso/outline/Top8_T.png"),
	"09" : preload("res://assets/character_sprite/body/torso/outline/Top9_T.png"),
	"10" : preload("res://assets/character_sprite/body/torso/outline/Top10_T.png"),
	"11" : preload("res://assets/character_sprite/body/torso/outline/Top11_T.png"),
	"12" : preload("res://assets/character_sprite/body/torso/outline/Top12_T.png"),
	"13" : preload("res://assets/character_sprite/body/torso/outline/Top13_T.png"),
	"14" : preload("res://assets/character_sprite/body/torso/outline/Top14_T.png"),
	"15" : preload("res://assets/character_sprite/body/torso/outline/Top15_T.png"),
	"16" : preload("res://assets/character_sprite/body/torso/outline/Top16_T.png"),
	"17" : preload("res://assets/character_sprite/body/torso/outline/Top17_T.png"),
	"18" : preload("res://assets/character_sprite/body/torso/outline/Top18_T.png"),
	"19" : preload("res://assets/character_sprite/body/torso/outline/Top19_T.png"),
}

# Left arm color sprite collection
var leftArmC_collection = {
	#"none" : null,
	"01" : preload("res://assets/character_sprite/body/left_arm/color/Top1C_L.png"),
	"02" : preload("res://assets/character_sprite/body/left_arm/color/Top2C_L.png"),
	"03" : preload("res://assets/character_sprite/body/left_arm/color/Top3C_L.png"),
	"04" : null,
	"05" : null,
	"06" : preload("res://assets/character_sprite/body/left_arm/color/Top6C_L.png"),
	"07" : preload("res://assets/character_sprite/body/left_arm/color/Top7C_L.png"),
	"08" : preload("res://assets/character_sprite/body/left_arm/color/Top8C_L.png"),
	"09" : preload("res://assets/character_sprite/body/left_arm/color/Top9C_L.png"),
	"10" : null,
	"11" : null,
	"12" : null,
	"13" : null,
	"14" : preload("res://assets/character_sprite/body/left_arm/color/Top14C_L.png"),
	"15" : preload("res://assets/character_sprite/body/left_arm/color/Top15C_L.png"),
	"16" : preload("res://assets/character_sprite/body/left_arm/color/Top16C_L.png"),
	"17" : preload("res://assets/character_sprite/body/left_arm/color/Top17C_L.png"),
	"18" : preload("res://assets/character_sprite/body/left_arm/color/Top18C_L.png"),
	"19" : preload("res://assets/character_sprite/body/left_arm/color/Top19C_L.png"),
}
# Left arm outline sprite collection
var leftArmO_collection = {
	#"none" : null,
	"01" : preload("res://assets/character_sprite/body/left_arm/outline/Top1_L.png"),
	"02" : preload("res://assets/character_sprite/body/left_arm/outline/Top2_L.png"),
	"03" : preload("res://assets/character_sprite/body/left_arm/outline/Top3_L.png"),
	"04" : null,
	"05" : null,
	"06" : preload("res://assets/character_sprite/body/left_arm/outline/Top6_L.png"),
	"07" : preload("res://assets/character_sprite/body/left_arm/outline/Top7_L.png"),
	"08" : preload("res://assets/character_sprite/body/left_arm/outline/Top8_L.png"),
	"09" : preload("res://assets/character_sprite/body/left_arm/outline/Top9_L.png"),
	"10" : null,
	"11" : null,
	"12" : null,
	"13" : null,
	"14" : preload("res://assets/character_sprite/body/left_arm/outline/Top14_L.png"),
	"15" : preload("res://assets/character_sprite/body/left_arm/outline/Top15__L.png"),
	"16" : preload("res://assets/character_sprite/body/left_arm/outline/Top16_L.png"),
	"17" : preload("res://assets/character_sprite/body/left_arm/outline/Top17_L.png"),
	"18" : preload("res://assets/character_sprite/body/left_arm/outline/Top18_L.png"),
	"19" : preload("res://assets/character_sprite/body/left_arm/outline/Top19_L.png"),
}

# Right arm color sprite collection
var rightArmC_collection = {
	#"none" : null,
	"01" : preload("res://assets/character_sprite/body/right_arm/color/Top1C_R.png"),
	"02" : preload("res://assets/character_sprite/body/right_arm/color/Top2C_R.png"),
	"03" : preload("res://assets/character_sprite/body/right_arm/color/Top3C_R.png"),
	"04" : null,
	"05" : null,
	"06" : preload("res://assets/character_sprite/body/right_arm/color/Top6C_R.png"),
	"07" : preload("res://assets/character_sprite/body/right_arm/color/Top7C_R.png"),
	"08" : preload("res://assets/character_sprite/body/right_arm/color/Top8C_R.png"),
	"09" : preload("res://assets/character_sprite/body/right_arm/color/Top9C_R.png"),
	"10" : null,
	"11" : null,
	"12" : null,
	"13" : null,
	"14" : preload("res://assets/character_sprite/body/right_arm/color/Top14C_R.png"),
	"15" : preload("res://assets/character_sprite/body/right_arm/color/Top15C_R.png"),
	"16" : preload("res://assets/character_sprite/body/right_arm/color/Top16C_R.png"),
	"17" : preload("res://assets/character_sprite/body/right_arm/color/Top17C_R.png"),
	"18" : preload("res://assets/character_sprite/body/right_arm/color/Top18C_R.png"),
	"19" : preload("res://assets/character_sprite/body/right_arm/color/Top19C_R.png"),
}
# Right arm outline sprite collection
var rightArmO_collection = {
	#"none" : null,
	"01" : preload("res://assets/character_sprite/body/right_arm/outline/Top1_R.png"),
	"02" : preload("res://assets/character_sprite/body/right_arm/outline/Top2_R.png"),
	"03" : preload("res://assets/character_sprite/body/right_arm/outline/Top3_R.png"),
	"04" : null,
	"05" : null,
	"06" : preload("res://assets/character_sprite/body/right_arm/outline/Top6_R.png"),
	"07" : preload("res://assets/character_sprite/body/right_arm/outline/Top7_R.png"),
	"08" : preload("res://assets/character_sprite/body/right_arm/outline/Top8_R.png"),
	"09" : preload("res://assets/character_sprite/body/right_arm/outline/Top9_R.png"),
	"10" : null,
	"11" : null,
	"12" : null,
	"13" : null,
	"14" : preload("res://assets/character_sprite/body/right_arm/outline/Top14_R.png"),
	"15" : preload("res://assets/character_sprite/body/right_arm/outline/Top15__R.png"),
	"16" : preload("res://assets/character_sprite/body/right_arm/outline/Top16_R.png"),
	"17" : preload("res://assets/character_sprite/body/right_arm/outline/Top17_R.png"),
	"18" : preload("res://assets/character_sprite/body/right_arm/outline/Top18_R.png"),
	"19" : preload("res://assets/character_sprite/body/right_arm/outline/Top19_R.png"),
}


# Leg color sprite collection
var legC_collection = {
	#"none" : null,
	"01" : preload("res://assets/character_sprite/body/legs/color/Bottom1C.png"),
	"02" : preload("res://assets/character_sprite/body/legs/color/Bottom2C.png"),
	"03" : preload("res://assets/character_sprite/body/legs/color/Bottom3C.png"),
	"04" : preload("res://assets/character_sprite/body/legs/color/Bottom4C.png"),
	"05" : preload("res://assets/character_sprite/body/legs/color/Bottom5C.png"),
	"06" : preload("res://assets/character_sprite/body/legs/color/Bottom6C.png"),
	"07" : preload("res://assets/character_sprite/body/legs/color/Bottom7C.png"),
	"08" : preload("res://assets/character_sprite/body/legs/color/Bottom8C.png"),
	"09" : preload("res://assets/character_sprite/body/legs/color/Bottom9C.png"),
	"10" : preload("res://assets/character_sprite/body/legs/color/Bottom10C.png"),
	"11" : preload("res://assets/character_sprite/body/legs/color/Bottom11C.png"),
	"12" : preload("res://assets/character_sprite/body/legs/color/Bottom12C.png"),
	"13" : preload("res://assets/character_sprite/body/legs/color/Bottom13C.png"),
	"14" : preload("res://assets/character_sprite/body/legs/color/Bottom14C.png"),
	"15" : preload("res://assets/character_sprite/body/legs/color/Bottom15C.png"),
}
# Leg outline sprite collection
var legO_collection = {
	#"none" : null,
	"01" : preload("res://assets/character_sprite/body/legs/outline/Bottom1.png"),
	"02" : preload("res://assets/character_sprite/body/legs/outline/Bottom2.png"),
	"03" : preload("res://assets/character_sprite/body/legs/outline/Bottom3.png"),
	"04" : preload("res://assets/character_sprite/body/legs/outline/Bottom4.png"),
	"05" : preload("res://assets/character_sprite/body/legs/outline/Bottom5.png"),
	"06" : preload("res://assets/character_sprite/body/legs/outline/Bottom6.png"),
	"07" : preload("res://assets/character_sprite/body/legs/outline/Bottom7.png"),
	"08" : preload("res://assets/character_sprite/body/legs/outline/Bottom8.png"),
	"09" : preload("res://assets/character_sprite/body/legs/outline/Bottom9.png"),
	"10" : preload("res://assets/character_sprite/body/legs/outline/Bottom10.png"),
	"11" : preload("res://assets/character_sprite/body/legs/outline/Bottom11.png"),
	"12" : preload("res://assets/character_sprite/body/legs/outline/Bottom12.png"),
	"13" : preload("res://assets/character_sprite/body/legs/outline/Bottom13.png"),
	"14" : preload("res://assets/character_sprite/body/legs/outline/Bottom14.png"),
	"15" : preload("res://assets/character_sprite/body/legs/outline/Bottom15.png"),
}

# Skintones
var body_colors = [
	Color(1, 1, 1),
	Color(0.96, 0.80, 0.69),
	Color(0.72, 0.54, 0.39),
	Color(0.45, 0.34, 0.27),
]

# Hair Colors
var hair_colors = [
	Color(1, 1, 1),
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
