class App {
  constructor() {
    this.canvas = new SlideCanvas();
    $("body").append(this.canvas.render());
    this.canvas.addElement(new SimpleContainer());
    this.canvas.layout(false);

    $(window).on("resize", () => {
      this.canvas.layout(false);
    });
  }
}

class SlideCanvas {
  render () {
    this.$el = $("<div/>").addClass("canvas");
    return this.$el;
  }

  layout (animate) {
    var padding = 50;
    var canvasWidth = window.innerWidth - padding * 2;
    var canvasHeight = window.innerHeight - padding * 2;
    this.$el.css("left", padding + "px").css("top", padding + "px").width(canvasWidth).height(canvasHeight);

    if (this.element) {
      this.element.childElements.forEach((box) => {
        box.layout({
          left: 0,
          top: 0,
          margin: 20,
          width: (canvasWidth/this.element.childElements.length) -40,
          height: 100
        }, animate)
      })
    }
  }

  addElement (element) {
    this.element = element;
    this.element.canvas = this;
    this.$el.append(element.render());
    element.renderUI();
  }
}

class BaseElement {
  render () {
    this.$el = $("<div/>");
    this.$el.addClass("element");
    return this.$el;
  }

  layout (bounds, animate) {
    if (animate) {
      this.$el.animate(bounds);
    } else {
      this.$el.css(bounds);
    }
  }

  renderUI () {
  }
}

////

class SimpleBox extends BaseElement {
  constructor(label) {
    super();
    this.label = label;
  }

  render () {
    this.$el = $("<div/>");
    this.$el.addClass("element simplebox");
    this.$el.text(this.label);
    return this.$el;
  }
}

class SimpleContainer extends BaseElement {
  constructor() {
    super();
    this.childElements = [];
  }

  render () {
    this.$el = $("<div/>");
    this.$el.addClass("element");
    this.addChildElement(new SimpleBox(this.childElements.length + 1));
    return this.$el;
  }

  layout () {
    var boxWidth = ((window.innerWidth - 140) / this.childElements.length)

    for(var i = 0; i < this.childElements.length; i++) {
      this.childElements[i].layout(
        {
          left: boxWidth * i,
          top: 0,
          margin: 20,
          width: boxWidth,
          height: 100
        }
      )
    }
  }

  renderUI () {
    var $button = $("<div/>").addClass("control").text("Add Item");
    this.$el.append($button);
    $button.on("click", () => {
      this.addChildElement(new SimpleBox(this.childElements.length + 1));
    });
  }

  addChildElement (element) {
    this.childElements.push(element);
    element.parentElement = this;
    console.log(element.parentElement)
    this.$el.append(element.render());
    element.renderUI();
    this.layout()
  }
}


