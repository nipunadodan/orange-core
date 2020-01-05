# Orange-core
Lightweight PHP framework

[![Latest Stable Version](https://poser.pugx.org/nipunadodan/orange-core/v/stable)](https://packagist.org/packages/nipunadodan/orange-core) [![License](https://poser.pugx.org/nipunadodan/orange-core/license)](https://packagist.org/packages/nipunadodan/orange-core)

## Requirements
* PHP 7.2+
* Enable cURL PHP Extension
* Enable JSON PHP Extension
* Enable MBString PHP Extension
 
 ## Dependencies
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