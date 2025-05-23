import * as util from "./util.mjs";

let _fp = new WeakMap()
export class Fingerprint {
  constructor (buf, fpSize) {
    if (!Buffer.isBuffer(buf) && typeof buf === 'object') {
      if (buf.fp) {
        if(typeof buf.fp !== 'object') {
          throw new TypeError('Invalid Fingerprint')
        }
        _fp.set(this, Buffer.from(buf.fp))
      } else {
        throw new TypeError('Invalid Fingerprint')
      }
    } else {
      if (!fpSize) {
        fpSize = 2
      }
      if (!Buffer.isBuffer(buf)) {
        throw new TypeError("Invalid Buffer")
      }
      if (!Number.isInteger(fpSize)) {
        throw new TypeError('Invalid Fingerprint Size')
      }
      if (fpSize > 4) {
        throw new TypeError('Fingerprint is larger than 4 bytes')
      }
      let fnv = util.fnvHash(buf)
      let fp = Buffer.alloc(fpSize, 0)
      for (let i = 0; i < fp.length; i++) {
        fp[ i ] = fnv[ i ]
      }
      if (fp.length === 0) {
        fp[ 0 ] = 7
      }
      _fp.set(this, fp)
    }
  }

  hash () {
    let fp = _fp.get(this)
    return util.hash(fp)
  }

  equals (fingerprint) {
    let fp1 = _fp.get(this)
    let fp2 = _fp.get(fingerprint)
    return fp1.equals(fp2)
  }

  toJSON () {
    let fp = _fp.get(this)
    return { fp: fp.toJSON() }
  }

  static fromJSON (obj) {
    return new Fingerprint(obj)
  }
}