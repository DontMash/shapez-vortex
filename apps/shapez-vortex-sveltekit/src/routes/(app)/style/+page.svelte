<script>
  import { section } from '$lib/components/section';
</script>

<section class="{section()} prose">
  <h1>Base Style</h1>
</section>

<section class="{section()} prose">
  <h2>Typography</h2>
  <hr />

  <h1>Heading 1</h1>
  <h2>Heading 2</h2>
  <h3>Heading 3</h3>
  <h4>Heading 4</h4>
  <h5>Heading 5</h5>
  <h6>Heading 6</h6>
  <p>Paragraph</p>

  <p><strong> Strong </strong></p>
  <p><b> Bold </b></p>
  <p><em> Emphasis </em></p>
  <p><i> Italic </i></p>
  <p><s> Strike </s></p>
  <p><mark> Mark </mark></p>
  <p>
    <small>
      This content should certainly be licensed under some general license of
      some kind.
    </small>
  </p>

  <p>
    Creating a well thought out <a href="#0">base style</a> for a new website is
    one of the most critical parts to ensure an overall successful project progression.
  </p>
  <p>
    The base style should contain all those basic HTML elements and their
    variations that will be needed within the website. May it be in standard
    formatted text, or within custom styled layout components.
  </p>
  <p>
    The goal is to abstract the element designs just to the right level, so that
    they can be used in any context without further modifications, but to keep
    them flexible enough for custom adjustments when needed, without having to
    overwrite many CSS attributes.
  </p>
  <p>
    The following markup is a best practice starting point to help you focus on
    what's important. It does not include <em>all</em> HTML elements, but as the
    theme is using
    <code>normalize.css</code>, elements will still be recoginzably styled, only
    without further customization.
  </p>

  <blockquote>
    Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy
    eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam
    voluptua.
  </blockquote>
  <p>
    <kbd>Ctrl</kbd> +
    <kbd>Shift</kbd>
  </p>
  <p>
    Almost every developer's favorite molecule is C<sub>8</sub>H<sub>10</sub
    >N<sub>4</sub>O<sub>2</sub>, also known as "caffeine".
  </p>

  <ul>
    <li>Item a</li>
    <li>Item b</li>
    <li>Item c</li>
  </ul>

  <ol>
    <li>Item 1</li>
    <li>Item 2</li>
    <li>Item 3</li>
  </ol>

  <table>
    <thead>
      <tr>
        <th scope="col">Id</th>
        <th scope="col">Column 1</th>
        <th scope="col">Column 2</th>
      </tr>
    </thead>

    <tbody>
      <tr>
        <th scope="row">0</th>
        <td>Value 1</td>
        <td>Button 1</td>
      </tr>
      <tr>
        <th scope="row">1</th>
        <td>Value 2</td>
        <td>Button 2</td>
      </tr>
      <tr>
        <th scope="row">2</th>
        <td>Value 3</td>
        <td>Button 3</td>
      </tr>
    </tbody>

    <tfoot>
      <tr>
        <th scope="row" colspan="2">Result</th>
        <td>Button Result</td>
      </tr>
    </tfoot>

    <caption>Table</caption>
  </table>
</section>
