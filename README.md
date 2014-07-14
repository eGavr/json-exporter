# json-exporter

Downloads all club's posts from the site 'my.ya.ru' by the given url and transforms them to github API structure

## Install

```bash
$ git clone https://github.com/eGavr/json-exporter.git

$ cd json-exporter

$ npm i
```

## Usage

```bash
$ bin/json-exporter --help

Usage:
  json-exporter [OPTIONS] [ARGS]


Options:
  -h, --help : Help
  -v, --version : Shows the version number
  --cli=CLI : URL-path to the latest data in club which is kept in JSON-format (required)
  -o OUTPUT, --output=OUTPUT : Output JSON-file
```

## Example

```bash
$ bin/json-exporter --cli=URL-path --output=res.json
```
