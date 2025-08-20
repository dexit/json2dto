import React from 'react';

const CliDocs: React.FC = () => {
  return (
    <div className="mb-10">
      <div className="max-w-6xl mx-auto mt-8 px-4">
        <div className="markdown">
          <h2>CLI Tool</h2>
          <p>
            Prefer to use the tool locally? You can install <code>json2dto</code> via composer and generate files directly from json files.
          </p>
          
          <pre><code>{`composer global require atymic/json2dto # Install Globally

composer require atymic/json2dto --dev # Install locally in a project`}</code></pre>

          <h3>Usage</h3>
          <p>
            The tool accepts json input either as a filename (second argument) or via <code>stdin</code>.<br />
            You should run the tool in the root of your project (where your <code>composer.json</code> is located) as it will resolve namespaces
            based on your PSR4 autoloading config. If you aren't using PSR4, your generated folder structure might not match.
          </p>

          <h4>Examples</h4>
          <pre><code>{`# Generate PHP 7.4 typed DTO
./vendor/bin/json2dto generate "App\\DTO" test.json -name "Test" --typed

# Generate PHP 8.0 typed DTO (DTO V3)
./vendor/bin/json2dto generate "App\\DTO" test.json -name "Test" --v3

# Generate a flexible DTO (with nested DTOs)
./vendor/bin/json2dto generate "App\\DTO" test.json -name "Test" --nested --flexible

# Generate a DTO from stdin
wget http://example.com/cat.json | ./vendor/bin/json2dto generate "App\\DTO" -name Cat`}</code></pre>

          <h4>Usage</h4>
          <pre><code>{`json2dto generate [options] [--] <namespace> [<json>]

Arguments:
  namespace                       Namespace to generate the class(es) in
  json                            File containing the json string

Options:
      --nested                    Generate nested DTOs
      --typed                     Generate PHP >= 7.4 strict typing
      --flexible                  Generate a flexible DTO
      --dry                       Dry run, print generated files
      --v3                        Generate V3 DTO
  -h, --help                      Display this help message`}</code></pre>
        </div>
      </div>
    </div>
  );
};

export default CliDocs;