import json
import re
import yaml


class VersionMismatchException(Exception):
    def __init__(self, message):
        super(VersionMismatchException, self).__init__(message)


def get_frontend_version():
    with open('frontend/package.json') as f:
        package = json.load(f)
    package_version = package['version']

    with open('frontend/package-lock.json') as f:
        package_lock = json.load(f)
    package_lock_version = package_lock['version']

    return package_version, package_lock_version


def get_backend_version():
    with open('backend/_version.py') as f:
        version_line = f.readline()
        return re.match("__version__\s?=\s?'([0-9]+\.[0-9]+\.[0-9]+)'", version_line).group(1)


def get_api_version():
    with open('backend/api_swagger.yml') as f:
        swagger = yaml.safe_load(f)
    return swagger['info']['version']


frontend_versions = get_frontend_version()
backend_version = get_backend_version()
api_version = get_api_version()

if frontend_versions[0] != frontend_versions[1]:
    raise VersionMismatchException(f'Version {frontend_versions[0]} in package.json does not match version'
                                   f' {frontend_versions[1]} in package-lock.json')

if frontend_versions[0] != backend_version:
    raise VersionMismatchException(f'Frontend version {frontend_versions[0]} does not match'
                                   f' backend version {backend_version}')

if backend_version != api_version:
    raise VersionMismatchException(f'Backend version {backend_version} does not match'
                                   f' api version {api_version}')

print('Version check ok.')
