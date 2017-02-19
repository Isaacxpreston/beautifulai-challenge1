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
    var boxWidth = ((window.innerWidth - 120) / this.childElements.length)

    for(var i = 0; i < this.childElements.length; i++) {
      this.childElements[i].layout(
        {
          top: (window.innerHeight - 100) / 3,
          left: (boxWidth * i) + 20,
          width: boxWidth -20,
          height: 100
        }
      )
    }
  }

  renderUI () {
    var $button = $("<div/>").addClass("control").text("Add Item");
    $button.css({
      zIndex: 100
    })
    this.$el.append($button);
    $button.on("click", () => {
      this.addChildElement(new SimpleBox(this.childElements.length + 1));
    });
  }

  addChildElement (element) {
    this.childElements.push(element);
    element.parentElement = this;
    this.$el.append(element.render());
    element.renderUI();
    this.layout()
  }
}


