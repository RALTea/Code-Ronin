require 'base64'

module Base64Service
  def self.encode(text)
    return nil if text.nil?
    Base64.strict_encode64(text.to_s.encode('UTF-8'))
  end

  def self.decode(text)
    return nil if text.nil?
    Base64.strict_decode64(text.to_s).force_encoding('UTF-8')
  end
end