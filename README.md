# Json 2 DTO

[![Build Status](https://img.shields.io/github/workflow/status/atymic/json2dto/PHP?style=flat-square)](https://github.com/atymic/json2dto/actions) 
[![StyleCI](https://styleci.io/repos/231837839/shield)](https://styleci.io/repos/231837839) 
[![Latest Version on Packagist](https://img.shields.io/packagist/v/atymic/json2dto.svg?style=flat-square)](https://packagist.org/packages/atymic/json2dto) 
[![Total Downloads](https://img.shields.io/packagist/dt/atymic/json2dto.svg?style=flat-square)](https://packagist.org/packages/atymic/json2dto) 

[Spatie's Data Transfer Object](https://github.com/spatie/data-transfer-object) library is awesome, but typing out DTOs
can quickly become a chore. Inspired by Json2Typescript style tools, we built one for PHP DTOs.

## Web Version

Try it out at [https://json2dto.atymic.dev](https://json2dto.atymic.dev)  
The web version has all of the same tools as the cli version in an easy to use React-based GUI. Features include:

- **Interactive JSON Editor**: Real-time JSON validation and formatting
- **Live DTO Generation**: Instant preview of generated PHP DTOs
- **Multiple PHP Versions**: Support for PHP 7.4+ typed properties and PHP 8.0+ attributes
- **Nested DTO Support**: Automatic generation of complex nested structures
- **Usage Examples**: Comprehensive examples showing real-world DTO usage patterns
- **CLI Documentation**: Complete guide for local development usage

When generating nested DTOs, the tool will create a zip file containing all related DTO classes.

[![](https://repository-images.githubusercontent.com/231837839/14ed4680-2fb2-11ea-81fe-f06c5038b0dd)](https://json2dto.atymic.dev)

## Complete Solution Tree

This repository provides a complete solution for working with DTOs:

### 🎯 **Frontend (React)**
- Modern React + TypeScript application
- Real-time JSON validation and DTO generation
- Interactive examples and documentation
- Responsive design with Tailwind CSS

### ⚙️ **Backend (PHP)**
- Robust DTO generation engine
- Support for multiple PHP versions
- Flexible and strict DTO modes
- Comprehensive validation

### 📚 **Examples & Documentation**
- Real-world usage patterns
- Service layer implementations
- API controller examples
- Best practices and guidelines

### 🛠️ **Development Tools**
- CLI tool for local development
- Docker support for easy deployment
- Comprehensive test suite
- CI/CD pipeline

## CLI Tool

Prefer to use the tool locally? You can install `json2dto` via composer and generate files directly from json files.

```bash
composer global require atymic/json2dto # Install Globally

composer require atymic/json2dto --dev # Install locally in a project
```

### Usage

The tool accepts json input either as a filename (second argument) or via `stdin`.  
You should run the tool in the root of your project (where your `composer.json` is located) as it will resolve namespaces
based on your PSR4 autoloading config. If you aren't using PSR4, your generated folder structure might not match.

#### Examples

```bash
# Generate PHP 7.4 typed DTO
./vendor/bin/json2dto generate "App\DTO" test.json -name "Test" --typed

# Generate PHP 8.0 typed DTO (DTO V3)
./vendor/bin/json2dto generate "App\DTO" test.json -name "Test" --v3

# Generate a flexible DTO (with nested DTOs)
./vendor/bin/json2dto generate "App\DTO" test.json -name "Test" --nested --flexible

# Generate a DTO from stdin
wget http://example.com/cat.json | ./vendor/bin/json2dto generate "App\DTO" -name Cat
```

#### Usage
```
json2dto generate [options] [--] <namespace> [<json>]

Arguments:
  namespace                       Namespace to generate the class(es) in
  json                            File containing the json string

Options:
      --nested                    Generate nested DTOs
      --typed                     Generate PHP >= 7.4 strict typing
      --flexible                  Generate a flexible DTO
      --dry                       Dry run, print generated files
      --v3                        Generate V3 DTO
  -h, --help                      Display this help message
```
