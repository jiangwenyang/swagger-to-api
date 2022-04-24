interface Service {
  name: string;
  url: string;
}

interface Config {
  services: Service[];
}

export { Config, Service };
