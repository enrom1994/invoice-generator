// Mock for @react-pdf/renderer
module.exports = {
  pdf: {
    toBlob: jest.fn().mockResolvedValue(new Blob()),
  },
  Document: function Document({ children }) {
    return children;
  },
  Page: function Page({ children }) {
    return children;
  },
  Text: function Text({ children }) {
    return children;
  },
  View: function View({ children }) {
    return children;
  },
  StyleSheet: {
    create: function(styles) {
      return styles;
    },
  },
  Image: function Image() {
    return null;
  },
  Font: {
    register: jest.fn(),
  },
  default: {
    pdf: {
      toBlob: jest.fn().mockResolvedValue(new Blob()),
    },
    Document: function Document({ children }) {
      return children;
    },
    Page: function Page({ children }) {
      return children;
    },
    Text: function Text({ children }) {
      return children;
    },
    View: function View({ children }) {
      return children;
    },
    StyleSheet: {
      create: function(styles) {
        return styles;
      },
    },
    Image: function Image() {
      return null;
    },
    Font: {
      register: jest.fn(),
    },
  },
};
