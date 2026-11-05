# Blueprint codec fixtures

`blueprint-codec.fixture.ts` pairs handwritten synthetic building/island objects with identifiers generated independently of the application codec. These are format fixtures, not in-game exports or proof of game compatibility. Each factory call returns fresh data.

The identifiers were generated once with Python 3.14's standard-library JSON, gzip, and base64 implementations. To reproduce an identifier, save the corresponding `blueprint` object as JSON and pipe it into:

```sh
python -c 'import base64,gzip,json,sys; data=json.dumps(json.load(sys.stdin),separators=(",", ":")).encode("utf8"); print("SHAPEZ2-1-"+base64.b64encode(gzip.compress(data,mtime=0)).decode("ascii")+"$")' < blueprint.json
```

Compression bytes can vary between library versions; tests compare decoded content, not identical compressed bytes. Encoding assertions use Node's independent zlib reader as well as application round trips.

The failure fixtures contain an invalid base64 character (`!`), base64-encoded `not-gzip` bytes, the building gzip stream with one bit flipped in its CRC32, and a valid gzip stream containing the invalid JSON text `{`. They assert failure without depending on dependency-specific error wording.

Cost assertions use literal examples checked independently with Python's high-precision `decimal` arithmetic: counts 0, 1, 2, 3, 4, 5, 10, and 100 correspond to costs 0, 0, 1, 3, 5, 7, 18, and 393. No expected cost is calculated by the tests.
