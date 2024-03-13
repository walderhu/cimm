class ArrayHelper {
  static clone(arr) {
    let out = Array.isArray(arr) ? Array() : {};
    for (let key in arr) {
      let value = arr[key];
      if (typeof value.clone === "function") {
        out[key] = value.clone();
      } else {
        out[key] = typeof value === "object" ? ArrayHelper.clone(value) : value;
      }
    }
    return out;
  }

  static equals(arrA, arrB) {
    if (arrA.length !== arrB.length) {
      return false;
    }
    let tmpA = arrA.slice().sort();
    let tmpB = arrB.slice().sort();

    for (var i = 0; i < tmpA.length; i++) {
      if (tmpA[i] !== tmpB[i]) {
        return false;
      }
    }
    return true;
  }

  static print(arr) {
    if (arr.length == 0) {
      return "";
    }
    let s = "(";
    for (let i = 0; i < arr.length; i++) {
      s += arr[i].id ? arr[i].id + ", " : arr[i] + ", ";
    }
    s = s.substring(0, s.length - 2);
    return s + ")";
  }

  static each(arr, callback) {
    for (let i = 0; i < arr.length; i++) {
      callback(arr[i]);
    }
  }

  static get(arr, property, value) {
    for (let i = 0; i < arr.length; i++) {
      if (arr[i][property] == value) {
        return arr[i];
      }
    }
  }

  static contains(arr, options) {
    if (!options.property && !options.func) {
      for (let i = 0; i < arr.length; i++) {
        if (arr[i] == options.value) {
          return true;
        }
      }
    } else if (options.func) {
      for (let i = 0; i < arr.length; i++) {
        if (options.func(arr[i])) {
          return true;
        }
      }
    } else {
      for (let i = 0; i < arr.length; i++) {
        if (arr[i][options.property] == options.value) {
          return true;
        }
      }
    }

    return false;
  }

  static intersection(arrA, arrB) {
    let intersection = new Array();
    for (let i = 0; i < arrA.length; i++) {
      for (let j = 0; j < arrB.length; j++) {
        if (arrA[i] === arrB[j]) {
          intersection.push(arrA[i]);
        }
      }
    }
    return intersection;
  }

  static unique(arr) {
    let contains = {};
    return arr.filter(function (i) {
      return contains[i] !== undefined ? false : (contains[i] = true);
    });
  }

  static count(arr, value) {
    let count = 0;
    for (let i = 0; i < arr.length; i++) {
      if (arr[i] === value) {
        count++;
      }
    }
    return count;
  }

  static toggle(arr, value) {
    let newArr = Array();
    let removed = false;
    for (let i = 0; i < arr.length; i++) {
      if (arr[i] !== value) {
        newArr.push(arr[i]);
      } else {
        removed = true;
      }
    }
    if (!removed) {
      newArr.push(value);
    }
    return newArr;
  }

  static remove(arr, value) {
    let tmp = Array();

    for (let i = 0; i < arr.length; i++) {
      if (arr[i] !== value) {
        tmp.push(arr[i]);
      }
    }

    return tmp;
  }

  static removeUnique(arr, value) {
    let index = arr.indexOf(value);

    if (index > -1) {
      arr.splice(index, 1);
    }
    return arr;
  }

  static removeAll(arrA, arrB) {
    return arrA.filter(function (item) {
      return arrB.indexOf(item) === -1;
    });
  }

  static merge(arrA, arrB) {
    let arr = new Array(arrA.length + arrB.length);
    for (let i = 0; i < arrA.length; i++) {
      arr[i] = arrA[i];
    }
    for (let i = 0; i < arrB.length; i++) {
      arr[arrA.length + i] = arrB[i];
    }
    return arr;
  }

  static containsAll(arrA, arrB) {
    let containing = 0;
    for (let i = 0; i < arrA.length; i++) {
      for (let j = 0; j < arrB.length; j++) {
        if (arrA[i] === arrB[j]) {
          containing++;
        }
      }
    }
    return containing === arrB.length;
  }

  static sortByAtomicNumberDesc(arr) {
    let map = arr.map(function (e, i) {
      return { index: i, value: e.atomicNumber.split(".").map(Number) };
    });
    map.sort(function (a, b) {
      let min = Math.min(b.value.length, a.value.length);
      let i = 0;

      while (i < min && b.value[i] === a.value[i]) {
        i++;
      }
      return i === min
        ? b.value.length - a.value.length
        : b.value[i] - a.value[i];
    });
    return map.map(function (e) {
      return arr[e.index];
    });
  }

  static deepCopy(arr) {
    let newArr = Array();
    for (let i = 0; i < arr.length; i++) {
      let item = arr[i];

      if (item instanceof Array) {
        newArr[i] = ArrayHelper.deepCopy(item);
      } else {
        newArr[i] = item;
      }
    }
    return newArr;
  }
}
module.exports = ArrayHelper;
