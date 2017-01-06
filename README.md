# Embedded.js

Embedded.js makes it easy to create and share responsive embeddable content.
The library will create IFRAMEs and help resize them automatically.

It used by [SimplyBuilt](https://www.simplybuilt.com/) and works great
with our Embedded Widget feature!

## Details

Embedded.js consist of 3 parts:

1. The hook script which loads the embed script and acts as an anchor for
   where content will be embedded.
2. The embed script which dynamically creates IFRAME elements and communicates
   with them to determine the height.
3. The client script which is used within the embedded content
   so it can communicate with the top-frame

## Quick Example

Suppose to we have some web content we want to be embeddable across the
web. The usually recipe for this is to embed the content through an IFrame.

Since this content may be consumed on a variety of devices, it needs to
be responsive and potentially variable in height. In order for embedding
to work well, the IFrame in the top document needs to be able to
dynamically resize itself to height of the content. To achieve this we can
use Embedded.js!

First, we setup a script tag with the hook and a few data attributes:

```html
<script src="/js/hook.js" data-api="/js/embed.js" data-location="http://example.com/embeddable-content"></script>
```

The `data-api` attribute specifies where to find the embed script. The
hook will only ever load the embed script once so this hook script tag
can be used multiple times within a page.

The `data-location` attribute tells Embedded.js what page to use for the
IFrame. It should point to the content you want to embed within your
page.

Now to communicate with the parent frame we only need to include the
client script within the embedded page. For example:

```html
<head>
  <script src="/js/hook.js"></script>
</head>
```

Now when IFrame will communiate with the parent document and resize the
IFrame accordingly!

## CDN Hosting

Coming soon!

## License

MIT

## Contributing

1. Fork it
2. Create your feature branch (`git checkout -b my-new-feature`)
3. Commit your changes (`git commit -am 'Add some feature'`)
4. Push to the branch (`git push origin my-new-feature`)
5. Create new Pull Request

Crafted with <3 by [@SimplyBuilt](https://twitter.com/SimplyBuilt).

***
