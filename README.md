M4 Static Vis Test Site

<!DOCTYPE html>
<html>
  <head>
    <title>Scrollytelling Poems</title>
    <link rel="stylesheet" type="text/css" href="styles.css" />
    <script src="https://d3js.org/d3.v7.min.js"></script>
  </head>
  <body>
    <header>
      <h1 class="title">Roses: A Scrollytelling Experience</h1>
    </header>
    <main class="wrapper">
      <div class="left-column">
        <div class="left-column-content">
          <div class="filler-verse"></div>
          <ul class="verse" id="verse1">
            <li class="line" id="line1">Roses are <span class="red-span">red</span></li>
            <li class="line" id="line2">And other colours too</li>
            <li class="line" id="line3">But out in nature</li>
            <li class="line" id="line4">You won't find them blue</li>
          </ul>

          <ul class="verse" id="verse2">
            <li class="line" id="line1">Violets <em>are</em> blue</li>
            <li class="line" id="line2">But typically <span class="purp-span">purple</span></li>
            <li class="line" id="line3">Unfortunately for this poem</li>
            <li class="line" id="line4">Nothing rhymes with <span class="purp-span">purple</span></li>
          </ul>

          <ul class="verse" id="verse3">
            <li class="line" id="line1">Now back to roses</li>
            <li class="line" id="line2">The classics are <span class="red-span">red</span></li>
            <li class="line" id="line3">Though white are quite trendy</li>
            <li class="line" id="line4">You can see there's quite a spread</li>
          </ul>

          <ul class="verse" id="verse4">
            <li class="line" id="line1">Roses are <span class="red-span">red</span></li>
            <li class="line" id="line2">Never really blue</li>
            <li class="line" id="line3">Let's put these bars in order</li>
            <li class="line" id="line4">So the graph looks nice too</li>
          </ul>

          <ul class="verse" id="verse5">
            <li class="line" id="line1">Flowers bloom and sway,</li>
            <li class="line" id="line2">In nature's grand ballet.</li>
            <li class="line" id="line3">Like pie charts, they display</li>
            <li class="line" id="line4">Life's colors in a vibrant array.</li>
          </ul>

          <div class="filler-verse"></div>
        </div>
      </div>
      <div class="right-column">
        <svg id="svg"></svg>
      </div>
    </main>
    <footer>
      <button class="arrow-button" id="backward-button" style="background-color: #335c67; border-radius: 3px;color: #0c1619;">◄</button>
      <button class="arrow-button" id="forward-button" style="background-color: #335c67; border-radius: 3px;color: #0c1619;">►</button>
    </footer>
    <script src="main.js"></script>
  </body>
</html>
