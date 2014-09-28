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

## Add some Navigation

```html
React.renderComponent(
  <InterExchange::Navigation />,
  document.getElementByTag('body')
);
```

<img src="/images/example/1-Navigation.gif" class="img-responsive" />

## Create a Structure

```html
<div class="row">
  <div class="col-xs-4">
    <h1>Example</h1>
  </div>
  <div class="col-xs-8">
    <!-- Future Code Goes Here -->
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
