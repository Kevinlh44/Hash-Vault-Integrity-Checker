import hashlib

def compute_hashes(file_bytes: bytes) -> dict:
    """Computes MD5, SHA1, and SHA256 hashes for the given bytes."""
    md5_hash = hashlib.md5()
    sha1_hash = hashlib.sha1()
    sha256_hash = hashlib.sha256()

    md5_hash.update(file_bytes)
    sha1_hash.update(file_bytes)
    sha256_hash.update(file_bytes)

    return {
        "MD5": md5_hash.hexdigest(),
        "SHA1": sha1_hash.hexdigest(),
        "SHA256": sha256_hash.hexdigest()
    }
