import time
import random
import string
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.service import Service as ChromeService
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

WAIT_TIME = 10 
DELAY_STEP = 2 
FINAL_DELAY = 5 

def random_string(length=10):
    letters = string.ascii_lowercase
    return ''.join(random.choice(letters) for i in range(length))

def test_register_user():
    driver = webdriver.Chrome(service=ChromeService(ChromeDriverManager().install()))
    wait = WebDriverWait(driver, WAIT_TIME)
    
    test_email = f"teste.usuario.{random_string(5)}@example.com"
    test_password = "senha1234"
    
    driver.get("https://front-five-iota.vercel.app/cadastro")
    print("Página de cadastro aberta.")
    time.sleep(DELAY_STEP) 

    # --- Preenche formulário de cadastro ---
    name_input = wait.until(EC.visibility_of_element_located((By.ID, "user-name")))
    name_input.send_keys(f"Teste Usuario {random_string(5)}")
    time.sleep(DELAY_STEP)

    email_input = driver.find_element(By.ID, "user-email")
    email_input.send_keys(test_email)
    time.sleep(DELAY_STEP)

    senha_input = driver.find_element(By.XPATH, "/html/body/div[2]/main/div/div/div[2]/div[1]/div[2]/form/div[3]/div/input")
    senha_input.send_keys(test_password)
    time.sleep(DELAY_STEP)

    confirm_senha_input = driver.find_element(By.XPATH, "/html/body/div[2]/main/div/div/div[2]/div[1]/div[2]/form/div[4]/div/input")
    confirm_senha_input.send_keys(test_password)
    time.sleep(DELAY_STEP)

    cadastrar_button = driver.find_element(By.XPATH, "/html/body/div[2]/main/div/div/div[2]/div[1]/div[2]/form/div[5]/button")
    cadastrar_button.click()
    time.sleep(DELAY_STEP)

    # --- Submissão final ---
    final_submit_button = wait.until(
        EC.element_to_be_clickable((By.XPATH, "/html/body/div[2]/main/div/div/div[2]/div[1]/div[2]/form/button"))
    )
    final_submit_button.click()
    time.sleep(DELAY_STEP)

    print(f"Usuário {test_email} cadastrado e logado com sucesso.")

    # --- Navegar até perfil ---
    logo_avatar = wait.until(
    EC.element_to_be_clickable((By.CSS_SELECTOR, "button[data-slot='dropdown-menu-trigger']"))
    )
    logo_avatar.click()
    time.sleep(DELAY_STEP)

    perfil_link = wait.until(
        EC.element_to_be_clickable((By.XPATH, "//a[@href='/usuario/perfil']"))
    )
    perfil_link.click()
    time.sleep(DELAY_STEP)

    # --- Editar perfil ---
    edit_button = wait.until(
        EC.element_to_be_clickable((By.XPATH, "//button[.//svg[contains(@class,'lucide-square-pen')]]"))
    )
    edit_button.click()
    time.sleep(DELAY_STEP)

    # Alterar nome
    nome_input = wait.until(EC.visibility_of_element_located((By.ID, "nome")))
    nome_input.clear()
    nome_input.send_keys("User Tested")
    time.sleep(DELAY_STEP)

    # Adicionar telefone
    phone_input = driver.find_element(By.ID, "phone")
    phone_input.send_keys("11999999999")
    time.sleep(DELAY_STEP)

    # Salvar alterações (supondo que exista um botão de salvar)
    salvar_button = driver.find_element(By.XPATH, "//button[contains(text(), 'Salvar')]")
    salvar_button.click()
    time.sleep(FINAL_DELAY)

    print("Perfil atualizado com sucesso.")

    # Mantém o navegador aberto
    # driver.quit()  # <-- Não fecha o navegador

if __name__ == "__main__":
    test_register_user()
