# Orange-core
Lightweight PHP framework

[![Version         ][packagist_badge]][packagist]

## Requirements
* PHP 7.2+
* Enable cURL PHP Extension
* Enable JSON PHP Extension
* Enable MBString PHP Extension
 
 ## Dependencies
* PHP-JWT : JWT token Genearation
* cURL : Http communication with the payment gateway

## Installation
### Composer
We recommend using [`Composer`](http://getcomposer.org). *(Note: we never recommend you
override the new secure-http default setting)*. 
*Update your composer.json file as per the example below and then run
`composer update`.*

```json
{
  "require": {
  "php": ">=7.2",
  "nipunadodan/orange-core": "^1.0.0"
  }
}
```