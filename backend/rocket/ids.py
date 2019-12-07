BODY_GREY_CAR_ID = 597  # DeLorean Time Machine
BODY_DARK_CAR_ID = 803  # '16 Batmobile
BODY_BERRY_ID = 2665  # The Dark Knight Rises Tumbler
BODY_EGGPLANT_ID = 2666  # '89 Batmobile
BODY_MAPLE_ID = 2919  # Jurassic Jeep® Wrangler
BODY_RYE_TIER1_ID = 3155  # Maverick
BODY_RYE_TIER2_ID = 3156  # Maverick G1
BODY_RYE_TIER3_ID = 3157  # Maverick GXT
BODY_ENSPIER_TIER3_ID = 3594  # Artemis GXT
BODY_ENSPIER_TIER1_ID = 3614  # Artemis
BODY_ENSPIER_TIER2_ID = 3622  # Artemis G1
BODY_MANGO_TIER3_ID = 3875  # Guardian GXT
BODY_MANGO_TIER1_ID = 3879  # Guardian
BODY_MANGO_TIER2_ID = 3880  # Guardian G1
BODY_FELINE_ID = 4014  # K.I.T.T.
BODY_SLIME_ID = 4155  # Ecto-1
BODY_MELON_TIER1_ID = 4318  # Mudcat
BODY_MELON_TIER2_ID = 4319  # Mudcat G1
BODY_MELON_TIER3_ID = 4320  # Mudcat GXT
BODY_DURIAN_TIER3_ID = 4472  # Chikara GXT
BODY_DURIAN_TIER1_ID = 4473  # Chikara
BODY_DURIAN_TIER2_ID = 4770  # Chikara G1


def tier_floor(body_id: int):
    # maverick
    if body_id == BODY_RYE_TIER2_ID or body_id == BODY_RYE_TIER3_ID:
        return BODY_RYE_TIER1_ID
    # artemis
    if body_id == BODY_ENSPIER_TIER2_ID or body_id == BODY_ENSPIER_TIER3_ID:
        return BODY_ENSPIER_TIER1_ID
    # Guardian
    if body_id == BODY_MANGO_TIER2_ID or body_id == BODY_MANGO_TIER3_ID:
        return BODY_MANGO_TIER1_ID
    # Mudcat
    if body_id == BODY_MELON_TIER2_ID or body_id == BODY_MELON_TIER3_ID:
        return BODY_MELON_TIER1_ID
    # Chikara
    if body_id == BODY_DURIAN_TIER2_ID or body_id == BODY_DURIAN_TIER3_ID:
        return BODY_DURIAN_TIER1_ID
    return body_id
