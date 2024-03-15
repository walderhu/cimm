def get_charge_text(charge):
    charge_map = {1: '+', 2: '2+', -1: '-', -2: '2-'}
    return charge_map.get(charge, '')
