# Installation

```html
<head>
  ....
    <!-- Include InterExchange Stylesheet -->
    <link rel="stylesheet" href="http://styleguide.interexchange.io/css/interexchange.min.css"/>

    <!-- Include InterExchange Javascript -->
    <script type="text/javascript" src="http://styleguide.interexchange.io/js/interexchange.js"></script>
    <script type="text/jsx" src="http://styleguide.interexchange.io/js/interexchange-components.js"></script>
  ...
</head>
```

# Example

## Create a Page

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Example</title>

    <!-- Include InterExchange Stylesheet -->
    <link rel="stylesheet" href="http://styleguide.interexchange.io/css/interexchange.min.css"/>

    <!-- Include InterExchange Javascript -->
    <script type="text/javascript" src="http://styleguide.interexchange.io/js/interexchange.js"></script>
    <script type="text/jsx" src="http://styleguide.interexchange.io/js/interexchange-components.js"></script>
  </head>
  <body>
    <!-- Continue From Here -->
  </body>
</html>
```

## Add some Navigation

```html
  <script type="text/jsx">
    /** @jsx React.DOM */

    React.renderComponent(
      <InterExchange::Navigation />,
      document.getElementByTag('body')
    );
  </script>
```

<img src="/images/example/1-Navigation.gif" class="img-responsive" />

## Create a Structure

```html
<div class="row">
  <div class="col-xs-4">
    <h1>Example</h1>
  </div>
  <div class="col-xs-8">
    <!-- Continue From Here -->
  </div>
</div>
```

<img src="/images/example/2-Structure.gif" class="img-responsive" />

## Embed some Participants

```html_example
  <script type="text/jsx">
    /** @jsx React.DOM */

    React.renderComponent(
      <ParticipantGroupPanels source="/json/participant-groups.json" />,
      document.getElementById('example')
    );
  </script>
```
# Usage

<img src="/images/index.gif" class="img-responsive" />
