extends Node

# Accessory outline sprite collection
var accessoryO_collection = {
	"none" : null,
	"01" : preload("res://assets/character_sprite/accessory/outline/Acc1.png"),
	"02" : preload("res://assets/character_sprite/accessory/outline/Acc2.png"),
	"03" : preload("res://assets/character_sprite/accessory/outline/Acc3.png"),
	"04" : preload("res://assets/character_sprite/accessory/outline/Acc4.png"),
	"05" : preload("res://assets/character_sprite/accessory/outline/Acc5.png"),
	"06" : preload("res://assets/character_sprite/accessory/outline/Acc6.png"),
	"07" : preload("res://assets/character_sprite/accessory/outline/Acc7.png"),
	"08" : preload("res://assets/character_sprite/accessory/outline/Acc8.png"),
	"09" : preload("res://assets/character_sprite/accessory/outline/Acc9.png"),
	"10" : preload("res://assets/character_sprite/accessory/outline/Acc10.png"),
	"11" : preload("res://assets/character_sprite/accessory/outline/Acc11.png"),
	"12" : preload("res://assets/character_sprite/accessory/outline/Acc12.png"),
	"13" : preload("res://assets/character_sprite/accessory/outline/Acc13.png"),
}

# Accessory color sprite collection
var accessoryC_collection = {
	"none" : null,
	"04" : preload("res://assets/character_sprite/accessory/color/Acc4C.png"),
	"05" : preload("res://assets/character_sprite/accessory/color/Acc5C.png"),
	"06" : preload("res://assets/character_sprite/accessory/color/Acc6C.png"),
	"07" : preload("res://assets/character_sprite/accessory/color/Acc7C.png"),
	"10" : preload("res://assets/character_sprite/accessory/color/Acc10C.png"),
	"11" : preload("res://assets/character_sprite/accessory/color/Acc11C.png"),
	"12" : preload("res://assets/character_sprite/accessory/color/Acc12C.png"),
	"13" : preload("res://assets/character_sprite/accessory/color/Acc13C.png"),
}

# Eyebrow sprite collection
var eyebrow_collection = {
	"none" : null,
	"01" : preload("res://assets/character_sprite/hair/eyebrows/Eyebrows1.png"),
	"02" : preload("res://assets/character_sprite/hair/eyebrows/Eyebrows2.png"),
	"03" : preload("res://assets/character_sprite/hair/eyebrows/Eyebrows3.png"),
	"04" : preload("res://assets/character_sprite/hair/eyebrows/Eyebrows4.png"),
	"05" : preload("res://assets/character_sprite/hair/eyebrows/Eyebrows5.png"),
	"06" : preload("res://assets/character_sprite/hair/eyebrows/Eyebrows6.png"),
	"07" : preload("res://assets/character_sprite/hair/eyebrows/Eyebrows7.png"),
	"08" : preload("res://assets/character_sprite/hair/eyebrows/Eyebrows8.png"),
	"09" : preload("res://assets/character_sprite/hair/eyebrows/Eyebrows9.png"),
	"10" : preload("res://assets/character_sprite/hair/eyebrows/Eyebrows10.png"),
}

# Eye sprite collection
var eye_collection = {
	"01" : preload("res://assets/character_sprite/body/head/eyes/Eyes1.png"),
	"02" : preload("res://assets/character_sprite/body/head/eyes/Eyes2.png"),
	"03" : preload("res://assets/character_sprite/body/head/eyes/Eyes3.png"),
	"04" : preload("res://assets/character_sprite/body/head/eyes/Eyes4.png"),
	"05" : preload("res://assets/character_sprite/body/head/eyes/Eyes5.png"),
	"06" : preload("res://assets/character_sprite/body/head/eyes/Eyes6.png"),
	"07" : preload("res://assets/character_sprite/body/head/eyes/Eyes7.png"),
	"08" : preload("res://assets/character_sprite/body/head/eyes/Eyes8.png"),
	"09" : preload("res://assets/character_sprite/body/head/eyes/Eyes9.png"),
	"10" : preload("res://assets/character_sprite/body/head/eyes/Eyes10.png"),
	"11" : preload("res://assets/character_sprite/body/head/eyes/Eyes11.png"),
	"12" : preload("res://assets/character_sprite/body/head/eyes/Eyes12.png"),
	"13" : preload("res://assets/character_sprite/body/head/eyes/Eyes13.png"),
	"14" : preload("res://assets/character_sprite/body/head/eyes/Eyes14.png"),
}

# Nose color sprite collection
var noseC_collection = {
	"01" : preload("res://assets/character_sprite/body/head/nose/color/Nose1C.png"),
	"02" : preload("res://assets/character_sprite/body/head/nose/color/Nose2C.png"),
	"03" : preload("res://assets/character_sprite/body/head/nose/color/Nose3C.png"),
	"04" : preload("res://assets/character_sprite/body/head/nose/color/Nose4C.png"),
	"05" : preload("res://assets/character_sprite/body/head/nose/color/Nose5C.png"),
	"06" : preload("res://assets/character_sprite/body/head/nose/color/Nose6C.png"),
	"07" : preload("res://assets/character_sprite/body/head/nose/color/Nose7C.png"),
	"08" : preload("res://assets/character_sprite/body/head/nose/color/Nose8C.png"),
	"09" : preload("res://assets/character_sprite/body/head/nose/color/Nose9C.png"),
	"10" : preload("res://assets/character_sprite/body/head/nose/color/Nose10C.png"),
}

# Nose outline sprite collection
var noseO_collection = {
	"01" : preload("res://assets/character_sprite/body/head/nose/outline/Nose1.png"),
	"02" : preload("res://assets/character_sprite/body/head/nose/outline/Nose2.png"),
	"03" : preload("res://assets/character_sprite/body/head/nose/outline/Nose3.png"),
	"04" : preload("res://assets/character_sprite/body/head/nose/outline/Nose4.png"),
	"05" : preload("res://assets/character_sprite/body/head/nose/outline/Nose5.png"),
	"06" : preload("res://assets/character_sprite/body/head/nose/outline/Nose6.png"),
	"07" : preload("res://assets/character_sprite/body/head/nose/outline/Nose7.png"),
	"08" : preload("res://assets/character_sprite/body/head/nose/outline/Nose8.png"),
	"09" : preload("res://assets/character_sprite/body/head/nose/outline/Nose9.png"),
	"10" : preload("res://assets/character_sprite/body/head/nose/outline/Nose10.png"),
}

# Mouth sprite collection
var mouth_collection = {
	"01" : preload("res://assets/character_sprite/body/head/mouth/Mouth1.png"),
	"02" : preload("res://assets/character_sprite/body/head/mouth/Mouth2.png"),
	"03" : preload("res://assets/character_sprite/body/head/mouth/Mouth3.png"),
	"04" : preload("res://assets/character_sprite/body/head/mouth/Mouth4.png"),
	"05" : preload("res://assets/character_sprite/body/head/mouth/Mouth5.png"),
	"06" : preload("res://assets/character_sprite/body/head/mouth/Mouth6.png"),
	"07" : preload("res://assets/character_sprite/body/head/mouth/Mouth7.png"),
	"08" : preload("res://assets/character_sprite/body/head/mouth/Mouth8.png"),
	"09" : preload("res://assets/character_sprite/body/head/mouth/Mouth9.png"),
	"10" : preload("res://assets/character_sprite/body/head/mouth/Mouth10.png"),
	"11" : preload("res://assets/character_sprite/body/head/mouth/Mouth11.png"),
	"12" : preload("res://assets/character_sprite/body/head/mouth/Mouth12.png"),
}

# Hair color sprite collection
var hairC_collection = {
	"none" : null,
	"01" : preload("res://assets/character_sprite/hair/color/Hair1C.png"),
	"02" : preload("res://assets/character_sprite/hair/color/Hair2C.png"),
	"03.1" : preload("res://assets/character_sprite/hair/color/Hair3C.png"),
	"03.2" : preload("res://assets/character_sprite/hair/color/Hair3C.png"),
	"03.3" : preload("res://assets/character_sprite/hair/color/Hair3C.png"),
	"04" : preload("res://assets/character_sprite/hair/color/Hair4C.png"),
	"05" : preload("res://assets/character_sprite/hair/color/Hair5C.png"),
	"06.1" : preload("res://assets/character_sprite/hair/color/Hair6C.png"),
	"06.2" : preload("res://assets/character_sprite/hair/color/Hair6C.png"),
	"06.3" : preload("res://assets/character_sprite/hair/color/Hair6C.png"),
	"07.1" : preload("res://assets/character_sprite/hair/color/Hair7C.png"),
	"07.2" : preload("res://assets/character_sprite/hair/color/Hair7C.png"),
	"07.3" : preload("res://assets/character_sprite/hair/color/Hair7C.png"),
	"08" : preload("res://assets/character_sprite/hair/color/Hair8C.png"),
	"09.1" : preload("res://assets/character_sprite/hair/color/Hair9C.png"),
	"09.2" : preload("res://assets/character_sprite/hair/color/Hair9C.png"),
	"09.3" : preload("res://assets/character_sprite/hair/color/Hair9C.png"),
	"10.1" : preload("res://assets/character_sprite/hair/color/Hair10C.png"),
	"10.2" : preload("res://assets/character_sprite/hair/color/Hair10C.png"),
	"10.3" : preload("res://assets/character_sprite/hair/color/Hair10C.png"),
	"11" : preload("res://assets/character_sprite/hair/color/Hair11C.png"),
	"12" : preload("res://assets/character_sprite/hair/color/Hair12C.png"),
}

# Hair outline sprite collection
var hairO_collection = {
	"none" : null,
	"01" : preload("res://assets/character_sprite/hair/outline/Hair1.png"),
	"02" : preload("res://assets/character_sprite/hair/outline/Hair2.png"),
	"03.1" : preload("res://assets/character_sprite/hair/outline/Hair3.png"),
	"03.2" : preload("res://assets/character_sprite/hair/outline/Hair3.png"),
	"03.3" : preload("res://assets/character_sprite/hair/outline/Hair3.png"),
	"04" : preload("res://assets/character_sprite/hair/outline/Hair4.png"),
	"05" : preload("res://assets/character_sprite/hair/outline/Hair5.png"),
	"06.1" : preload("res://assets/character_sprite/hair/outline/Hair6.png"),
	"06.2" : preload("res://assets/character_sprite/hair/outline/Hair6.png"),
	"06.3" : preload("res://assets/character_sprite/hair/outline/Hair6.png"),
	"07.1" : preload("res://assets/character_sprite/hair/outline/Hair7.png"),
	"07.2" : preload("res://assets/character_sprite/hair/outline/Hair7.png"),
	"07.3" : preload("res://assets/character_sprite/hair/outline/Hair7.png"),
	"08" : preload("res://assets/character_sprite/hair/outline/Hair8.png"),
	"09.1" : preload("res://assets/character_sprite/hair/outline/Hair9.png"),
	"09.2" : preload("res://assets/character_sprite/hair/outline/Hair9.png"),
	"09.3" : preload("res://assets/character_sprite/hair/outline/Hair9.png"),
	"10.1" : preload("res://assets/character_sprite/hair/outline/Hair10.png"),
	"10.2" : preload("res://assets/character_sprite/hair/outline/Hair10.png"),
	"10.3" : preload("res://assets/character_sprite/hair/outline/Hair10.png"),
	"11" : preload("res://assets/character_sprite/hair/outline/Hair11.png"),
	"12" : preload("res://assets/character_sprite/hair/outline/Hair12.png"),
}

# Back hair color sprite collection
var hair_backC_collection = {
	"06.2" : preload("res://assets/character_sprite/hair_back/color/UnderHair1C.png"),
	"07.2" : preload("res://assets/character_sprite/hair_back/color/UnderHair1C.png"),
	"06.3" : preload("res://assets/character_sprite/hair_back/color/UnderHair2C.png"),
	"07.3" : preload("res://assets/character_sprite/hair_back/color/UnderHair2C.png"),
	"04" : preload("res://assets/character_sprite/hair_back/color/UnderHair3C.png"),
	"09.2" : preload("res://assets/character_sprite/hair_back/color/UnderHair4C.png"),
	"10.2" : preload("res://assets/character_sprite/hair_back/color/UnderHair4C.png"),
	"09.3" : preload("res://assets/character_sprite/hair_back/color/UnderHair5C.png"),
	"10.3" : preload("res://assets/character_sprite/hair_back/color/UnderHair5C.png"),
	"03.3" : preload("res://assets/character_sprite/hair_back/color/UnderHair6C.png"),
	"03.1" : preload("res://assets/character_sprite/hair_back/color/UnderHair7C.png"),
	"03.2" : preload("res://assets/character_sprite/hair_back/color/UnderHair8C.png"),
}

# Back hair outline sprite collection
var hair_backO_collection = {
	"06.2" : preload("res://assets/character_sprite/hair_back/outline/UnderHair1.png"),
	"07.2" : preload("res://assets/character_sprite/hair_back/outline/UnderHair1.png"),
	"06.3" : preload("res://assets/character_sprite/hair_back/outline/UnderHair2.png"),
	"07.3" : preload("res://assets/character_sprite/hair_back/outline/UnderHair2.png"),
	"04" : null,
	"09.2" : preload("res://assets/character_sprite/hair_back/outline/UnderHair4.png"),
	"10.2" : preload("res://assets/character_sprite/hair_back/outline/UnderHair4.png"),
	"09.3" : preload("res://assets/character_sprite/hair_back/outline/UnderHair5.png"),
	"10.3" : preload("res://assets/character_sprite/hair_back/outline/UnderHair5.png"),
	"03.3" : preload("res://assets/character_sprite/hair_back/outline/UnderHair6.png"),
	"03.1" : preload("res://assets/character_sprite/hair_back/outline/UnderHair7.png"),
	"03.2" : preload("res://assets/character_sprite/hair_back/outline/UnderHair8.png"),
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

# Shoe color sprite collection
var shoeC_collection = {
	"none" : null,
	"01" : preload("res://assets/character_sprite/body/shoes/color/Shoes1C.png"),
	"02" : preload("res://assets/character_sprite/body/shoes/color/Shoes2C.png"),
	"03" : preload("res://assets/character_sprite/body/shoes/color/Shoes3C.png"),
	"04" : preload("res://assets/character_sprite/body/shoes/color/Shoes4C.png"),
	"05" : preload("res://assets/character_sprite/body/shoes/color/Shoes5C.png"),
}

# Shoe outline sprite collection
var shoeO_collection = {
	"none" : null,
	"01" : preload("res://assets/character_sprite/body/shoes/outline/Shoes1.png"),
	"02" : preload("res://assets/character_sprite/body/shoes/outline/Shoes2.png"),
	"03" : preload("res://assets/character_sprite/body/shoes/outline/Shoes3.png"),
	"04" : preload("res://assets/character_sprite/body/shoes/outline/Shoes4.png"),
	"05" : preload("res://assets/character_sprite/body/shoes/outline/Shoes5.png"),
}

# Skintones
var body_colors = [
	Color(1, 1, 1),
	Color.from_rgba8(240, 197, 178),
	Color.from_rgba8(210, 167, 151),
	Color.from_rgba8(235, 178, 148),
	Color.from_rgba8(219, 150, 119),
	Color.from_rgba8(202, 151, 115),
	Color.from_rgba8(167, 115, 98),
	Color.from_rgba8(172, 108, 85),
	Color.from_rgba8(156, 95, 67),
	Color.from_rgba8(96, 48, 42),
	Color.from_rgba8(80, 48, 33),
	Color.from_rgba8(69, 42, 36),
	Color.from_rgba8(50, 33, 23),
	Color.from_rgba8(39, 27, 15),
	#Color(0.96, 0.80, 0.69),
	#Color(0.72, 0.54, 0.39),
	#Color(0.45, 0.34, 0.27),
]

# Hair Colors
var hair_colors = [
	#Color(1, 1, 1),
	Color.from_rgba8(96, 48, 42),
	Color.from_rgba8(46, 23, 0),
	Color.from_rgba8(241, 207, 95),
	Color.from_rgba8(42, 42, 42),
	#Color.from_rgba8(65, 65, 65),
	Color.from_rgba8(227, 171, 128),
	Color.from_rgba8(142, 50, 41),
	#Color(.96, .48, .42),
	#Color(.46, .23, 0),
	#Color(0.1, 0.1, 0.1),
	#Color(0.4, 0.2, 0.1),
	#Color(0.9, 0.6, 0.2),
	#Color(0.5, 0.25, 0),
]

# Outfits and Accessory colors
var colors = [
	Color.from_rgba8(221, 110, 0),
	Color(1, 1, 1), # Default
	Color(1, 0, 0),
	Color(0, 1, 0),
	Color(0, 0, 1),
	Color(0, 0, 0),
	Color(1, 1, 1),
]

# Selected Values
var selected_accessory = ""
var selected_eyebrow = ""
var selected_eye = ""
var selected_nose = ""
var selected_mouth = ""
var selected_hair = ""
var selected_outfit = ""
var selected_legs = ""
var selected_shoe = ""
var selected_accessory_color = ""
var selected_body_color = ""
#var selected_nose_color = ""
var selected_hair_color = ""
var selected_outfit_color = ""
var selected_legs_color = ""
var selected_shoe_color = ""
