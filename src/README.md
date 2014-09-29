# Installation

```html
<head>
  ....
    <!-- Include InterExchange Stylesheet -->
    <link rel="stylesheet" href="http://iex-assets.s3.amazonaws.com/css/interexchange.min.css"/>

    <!-- Include InterExchange Javascript -->
    <script type="text/javascript" src="http://iex-assets.s3.amazonaws.com/js/interexchange.js"></script>
    <script type="text/jsx" src="http://iex-assets.s3.amazonaws.com/js/interexchange-components.js"></script>
  ...
</head>
```

# Example

```html_example
<h3 class="page-header">Participant Groups</h3>
<div id="ParticipantGroupPanels" />

<script type="text/jsx">
  /** @jsx React.DOM */

  React.renderComponent(
    <ParticipantGroupPanels source="/json/participant-groups.json" />,
    document.getElementById('ParticipantGroupPanels')
  );
</script>
```
# Usage

<img src="/images/index.gif" class="img-responsive" />
