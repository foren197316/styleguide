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

## Create a Structure

```html_example
<div class="row">
  <div class="col-xs-12">
    <h3>Participant Group Panels</h3>
  </div>
</div>
```

## Embed some Participants

```html_example
  <div class="row">
    <div class="col-xs-12">
      <h3>Participant Group Panels</h3>

      <div id="participant-group-panels" />
      <script type="text/jsx">
        /** @jsx React.DOM */

        React.renderComponent(
          <ParticipantGroupPanels source="/json/participant-groups.json" />,
          document.getElementById('participant-group-panels')
        );
      </script>
    </div>
  </div>
```
# Usage

<img src="/images/index.gif" class="img-responsive" />
