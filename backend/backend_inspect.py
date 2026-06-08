from pydantic_settings import BaseSettings, SettingsConfigDict
from huggingface_hub import InferenceClient
import huggingface_hub
import inspect

class S(BaseSettings):
    foo: str = 'bar'
    model_config = SettingsConfigDict(extra='allow', env_file='.env', env_file_encoding='utf-8')

print('model_config:', S.model_config)
print('foo:', S().foo)
print('has model_config:', hasattr(S, 'model_config'))
print('hf version:', huggingface_hub.__version__)
print('InferenceClient sig:', inspect.signature(InferenceClient))
print('provider annotation:', inspect.signature(InferenceClient).parameters['provider'].annotation)
try:
    import huggingface_hub.inference._providers as p
    members = [n for n in dir(p) if 'provider' in n.lower() or 'mapping' in n.lower() or 'helper' in n.lower()]
    print('provider members:', members)
    print('dir has length', len(dir(p)))
except Exception as e:
    print('provider inspect error:', e)
