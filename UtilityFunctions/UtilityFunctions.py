def get_charge_text(charge):
    if charge == 1:
        return '+'
    elif charge == 2:
        return '2+'
    elif charge == -1:
        return '-'
    elif charge == -2:
        return '2-'
    else:
        return ''