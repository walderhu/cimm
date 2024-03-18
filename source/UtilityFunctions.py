def getChargeText(charge: float) -> str:
    'Translate the integer indicating the charge to the appropriate text.'
    charge_map = {1: '+', 2: '2+', -1: '-', -2: '2-'}
    return charge_map.get(charge, '')
