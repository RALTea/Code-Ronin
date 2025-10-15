require 'base64'

module Base64Service
  def self.encode(text)
    return nil if text.nil?
    Base64.strict_encode64(text.to_s.encode('UTF-8'))
  end

  def self.decode(text)
    return nil if text.nil?
    Base64.strict_decode64(text.to_s).force_encoding('UTF-8')
  rescue ArgumentError
    # If decoding fails, it might be URL-encoded. Try URL-decoding first.
    decoded = URI.decode_www_form_component(text.to_s)
    Base64.strict_decode64(decoded).force_encoding('UTF-8')
  end
end