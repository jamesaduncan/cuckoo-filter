// compied verbatim from https://github.com/fluidecho/fnv32/blob/master/lib/fnv32.js


var FNV = function () {
  this.offset_basis = 2166136261;    // The prime, 32 bit offset_basis = 2,166,136,261 = 0x811C9DC5.	
};
const fnv = new FNV();

FNV.prototype.fnv_1 = function ( data ) {

  if ( typeof data === 'string' ) {
    data = new Buffer(data);
  }

  if ( !Buffer.isBuffer(data) ) {
    throw new Error('fnv32 input must be a String or Buffer.');
  }

  var hashint = this.offset_basis;

  for ( var i = 0; i < data.length; i++ ) {
    hashint += (hashint << 1) + (hashint << 4) + (hashint << 7) + (hashint << 8) + (hashint << 24);
    hashint = hashint ^ data[i];
  }

  return hashint >>> 0;    // unsigned 32 bit integer.

};


FNV.prototype.fnv_1a = function ( data ) {

  if ( typeof data === 'string' ) {
    data = new Buffer(data);
  }

  if ( !Buffer.isBuffer(data) ) {
    throw new Error('fnv32 input must be a String or Buffer.');
  }

  var hashint = this.offset_basis;

  for ( var i = 0; i < data.length; i++ ) {
    hashint = hashint ^ data[i];
    hashint += (hashint << 1) + (hashint << 4) + (hashint << 7) + (hashint << 8) + (hashint << 24);
  }

  return hashint >>> 0;    // unsigned 32 bit integer.

};


// To be compatible with: https://tools.ietf.org/html/draft-eastlake-fnv-12#page-6
FNV.prototype.toBufferLE = function ( hashint ) {

  if ( typeof hashint != 'number' ) {
    throw new Error('fnv32.toBufferLE input must be a Number.');
  }

  var buf = new Buffer(4);
  buf[0] = hashint & 0xff;
  buf[1] = hashint >>> 8 & 0xff;
  buf[2] = hashint >>> 16 & 0xff;
  buf[3] = hashint >>> 24 & 0xff;

  return buf;    // 32 bit little endian Buffer.
  
};

export function hash (buf) {
  if (!Buffer.isBuffer(buf)) {
    throw new TypeError("Invalid Buffer")
  }
  let hash = 5381
  for (let i = 0; i < buf.length; i++) {
    hash = (((hash << 5) >>> 0 ) + hash) + buf[ i ]
  }
  return hash
}
export function fnvHash (buf) {
  if (!Buffer.isBuffer(buf)) {
    throw new TypeError("Invalid Buffer")
  }
  return fnv.toBufferLE(fnv.fnv_1a(buf))
}

export function getRandomInt (min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}
export function numberToBuffer (num) {
  if (isNaN(num)) {
    throw new TypeError('Invalid Number')
  }
  let hex = num.toString(16)
  if (hex % 2 == 1) {
    hex = '0' + hex
  }
  return Buffer.from(hex, 'hex')
}

export default {
  hash: hash,
  fnvHash: fnvHash,
  getRandomInt: getRandomInt,
  numberToBuffer: numberToBuffer
}
