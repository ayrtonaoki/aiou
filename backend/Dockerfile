FROM ruby:3.2

RUN apt-get update -qq && apt-get install -y \
  nodejs \
  postgresql-client \
  build-essential \
  libpq-dev

WORKDIR /app

COPY Gemfile Gemfile.lock ./

ENV BUNDLE_PATH=/usr/local/bundle

RUN bundle install

COPY . .

EXPOSE 3000

CMD ["rails", "server", "-b", "0.0.0.0"]
